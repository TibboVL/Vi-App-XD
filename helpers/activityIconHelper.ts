import { Activity, PillarKey, Pillars } from "@/types/activity";
import pluralize from "pluralize";
import {
  Barbell,
  Bed,
  Book,
  Brain,
  Camera,
  Code,
  Football,
  MoonStars,
  MusicNotes,
  PaintBrush,
  PersonSimpleBike,
  PersonSimpleHike,
  PersonSimpleRun,
  PersonSimpleTaiChi,
  PintGlass,
  User,
  Users,
} from "phosphor-react-native";

// Map keywords or tags to icon components
const keywordIconMap: Record<string, React.FC<any>> = {
  run: PersonSimpleRun,
  jog: PersonSimpleRun,
  walk: PersonSimpleRun,
  hike: PersonSimpleHike,
  cycle: PersonSimpleBike,
  bike: PersonSimpleBike,
  yoga: PersonSimpleTaiChi,
  stretch: PersonSimpleTaiChi,
  meditation: MoonStars,
  group: Users,
  team: Users,
  football: Football,
  soccer: Football,
  music: MusicNotes,
  sing: MusicNotes,
  read: Book,
  study: Book,
  journal: Book,
  photo: Camera,
  photography: Camera,
  paint: PaintBrush,
  draw: PaintBrush,
  code: Code,
  exercise: Barbell,
  nap: Bed,
  sleep: Bed,
  rest: Bed,
  drink: PintGlass,
  water: PintGlass,
  // add more as needed
};
export function getIconByActivity(activity: Activity): React.FC<any> {
  // 1. Keyword search in name (case-insensitive, safe)
  const name = activity?.name?.toLowerCase() ?? "";

  for (const keyword in keywordIconMap) {
    if (name.includes(keyword)) {
      return keywordIconMap[pluralize.singular(keyword)];
    }
  }

  // 2. Optional: search in category/tags (uncomment if using tags)
  if (Array.isArray(activity?.category)) {
    for (const tag of activity.category) {
      const icon = keywordIconMap[pluralize.singular(tag.toLowerCase())];
      if (icon) return icon;
    }
  }

  // 3. Fallback to pillar-based logic
  const pillar = Pillars?.[activity.pillar];

  switch (pillar) {
    case Pillars.social:
      return Users;
    case Pillars.mindfulness:
      return PersonSimpleTaiChi;
    case Pillars.skills:
      return Brain;
    case Pillars.sport:
      return PersonSimpleRun;
    default:
      if (__DEV__) {
        console.warn(
          `Unrecognized activity fallback:`,
          activity,
          pluralize.singular(activity.category)
        );
      }
      return User; // Final default
  }
}
