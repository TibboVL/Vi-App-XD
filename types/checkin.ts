import { Mood } from "./mood";

export interface CurrentCheckin {
  checkinId: number;
  validAtDate: string | null;
  moodId: number;
  energy: number;
  mood: string;
  parentMoodId: number;
  parentMood: string;
}
export interface Checkin {
  checkinId: number;
  userId: number;
  beforeMoodId: number;
  beforeEnergyLevel: number;
  afterMoodId: number;
  afterEnergyLevel: number;
  userActivityId: number;
  created_at: string | null;
}

export interface ExtendedCheckin extends Checkin {
  afterMood: string;
  beforeMood: string;
  afterParentMoodId: number;
  afterParentMood: string;
  beforeParentMoodId: number;
  beforeParentMood: string;
  createdAt: string | null;
  plannedEnd: string | null;
}
