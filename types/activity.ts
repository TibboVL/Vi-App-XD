export type Activity = {
  activityId: number;
  name: string;
  energyRequired: EnergyLevel;
  estimatedDurationMinutes: number;
  currency: string;
  estimatedCost: number;
  isGroupActivity: boolean;
  category: string;
  pillar: PillarKey;
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
  sport: {
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
