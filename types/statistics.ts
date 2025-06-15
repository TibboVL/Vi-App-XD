import { Category, PillarKey } from "./activity";
export type PerPillarStatistics = {
  activityId: number;
  plannedStart: string;
  plannedEnd: string;
  pillarId: number;
  name: PillarKey;
  durationseconds: string;
  date: string;
};

export type StatisticWrapper = {
  start: string;
  end: string;
  pillarStats: Record<string, number>;
  statistics: PerPillarStatistics[];
};

export type EnergyStatisticsWrapper = {
  start: string;
  end: string;
  statistics: EnergyStatistics[];
};

export type EnergyStatistics = {
  energy: number;
  date: string;
};

export type PerPillarAverageDeltas = {
  deltaAlertness: number;
  deltaEnjoyment: number;
  deltaEnergy: number;
  normalizedDeltaEnergy: number;
  combinedDeltaMood: number;
};

export type PerActivityStatistics = {
  activityId: number;
  activityTitle: string;
  categories: Category[];
  basedOnCheckinAmount: number;
  averageDeltas: PerPillarAverageDeltas;
};
