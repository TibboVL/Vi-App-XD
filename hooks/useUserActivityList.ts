import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import {
  CompactUserActivityListDayContainer,
  CompactUserActivityListItem,
} from "@/types/userActivityList";

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
