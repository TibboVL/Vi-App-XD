import { Category } from "./activity";

export type CompactUserActivityListItem = {
  userActivityId: number;
  userId: number;
  activityId: number;
  activityTitle: string;
  plannedStart: string | null; // ISO 8601 string
  plannedEnd: string | null; // ISO 8601 string
  markedCompletedAt: string | null; // ISO 8601 string
  categories: Category[];
};

export type CompactUserActivityListDayContainer = {
  title: string | null; // ISO 8601 string
  data: CompactUserActivityListItem[];
};
