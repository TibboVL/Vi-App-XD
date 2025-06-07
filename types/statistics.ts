import { Dictionary } from "lodash";
import { PillarKey } from "./activity";
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
  statistics: PerPillarStatistics[];
};
