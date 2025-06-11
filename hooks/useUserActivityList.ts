import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import {
  CompactUserActivityListDayContainer,
  CompactUserActivityListItem,
} from "@/types/userActivityList";
import { Checkin } from "@/types/checkin";

export const useGetUserActivityList = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<CompactUserActivityListDayContainer[]>({
    queryKey: ["user-activity-list"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: CompactUserActivityListDayContainer[];
      }>(`/useractivitylist/`);
      return result.data as CompactUserActivityListDayContainer[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};

export const useGetUserActivityListsItemsReview = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<CompactUserActivityListItem[]>({
    queryKey: ["user-activity-list-to-review"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: CompactUserActivityListItem[];
      }>(`/useractivitylist/toReview`);
      return result.data;
    },
    staleTime: 0, // never save these
    enabled: enabled,
  });
};

export const usePostUserActivityList = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({
      activityId,
      plannedStart,
      plannedEnd,
      suggestedActivityId,
    }: {
      activityId: string | number;
      plannedStart: Date;
      plannedEnd: Date;
      suggestedActivityId: string | number;
    }) => {
      const result = await api<{
        data: CompactUserActivityListItem;
      }>(`/useractivitylist/add`, {
        method: "POST",
        body: JSON.stringify({
          activityId,
          plannedStart: plannedStart.toISOString(),
          plannedEnd: plannedEnd.toISOString(),
          suggestedActivityId,
        }),
      });

      return result.data;
    },
  });
};

export const usePostUserActivityListItemReview = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({
      beforeMoodId,
      afterMoodId,
      beforeEnergy,
      afterEnergy,
      userActivityId,
    }: {
      beforeMoodId: number | null;
      afterMoodId: number | null;
      beforeEnergy: number | null;
      afterEnergy: number | null;
      userActivityId: number | null;
    }) => {
      const result = await api<{
        data: Checkin;
      }>(`/checkin/add`, {
        method: "POST",
        body: JSON.stringify({
          beforeMoodId,
          afterMoodId,
          beforeEnergy,
          afterEnergy,
          userActivityId,
        }),
      });

      return result.data;
    },
  });
};

export const useUpdateUserActivityList = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({
      userActivityId,
      plannedStart,
      plannedEnd,
    }: {
      userActivityId: number | string;
      plannedStart: Date;
      plannedEnd: Date;
    }) => {
      const result = await api<{
        data: CompactUserActivityListItem;
      }>(`/useractivitylist/update`, {
        method: "POST",
        body: JSON.stringify({
          userActivityId: userActivityId,
          plannedStart: plannedStart.toISOString(),
          plannedEnd: plannedEnd.toISOString(),
        }),
      });

      return result.data;
    },
  });
};

export const useDeleteActivityList = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({
      userActivityId,
    }: {
      userActivityId: string | number;
    }) => {
      console.log(userActivityId);
      await api(`/useractivitylist/delete?userActivityId=${userActivityId}`, {
        method: "DELETE",
      });
      return userActivityId;
    },
  });
};
