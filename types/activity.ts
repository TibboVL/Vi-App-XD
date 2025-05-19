export type Activity = {
  activityId: number;
  name: string;
  energyRequired: EnergyLevel;
  estimatedDurationMinutes: number;
  currency: string;
  estimatedCost: number;
  isGroupActivity: boolean;
  categories: Category[];
  debugUITId: string;
  lat: number | null;
  lon: number | null;
};
export type ActivityDetails = {
  activityId: number;
  name: string;
  energyRequired: EnergyLevel;
  estimatedDurationMinutes: number;
  currency: string;
  estimatedCost: number;
  isGroupActivity: boolean;
  categories: Category[];
  debugUITId: string | null;

  description: string;
  source: string;
  startDate: string | null; // ISO 8601 string
  endDate: string | null;
  locationName: string | null;
  locationDescription: string | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  locationCity: string | null;
  locationStreetAddress: string | null;
  locationPostcode: string | null;
  locationCountry: string | null;
  contactEmails: string[] | null;
  contactPhones: string[] | null;
  contactURLs: string[] | null;
  minAge: number | null;
  maxAge: number | null;
  openingHoursStructured: OpeningHours[] | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OpeningHours = {
  weekday: Weekday;
  intervals: OpensCloses[];
};

export type OpensCloses = {
  opens: string; // Format: "HH:mm"
  closes: string; // Format: "HH:mm"
};

export enum Weekday {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export type Category = {
  name: string;
  pillar: string;
};

export enum EnergyLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  VeryHigh = "Very high",
}

export const Pillars = {
  mindfulness: {
    title: "Mindfulness",
    color: "#5bc0eb",
  },
  physical: {
    title: "Sport",
    color: "#58d68d",
  },
  social: {
    title: "Social",
    color: "#ffa552",
  },
  skills: {
    title: "Skills",
    color: "#a66dd4",
  },
} as const;

export type PillarKey = keyof typeof Pillars;

export function getPillarInfo(pillar: PillarKey) {
  return Pillars[pillar];
}
