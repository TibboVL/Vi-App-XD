import { StaleTime } from "./../node_modules/@tanstack/query-core/src/types";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { CompactUserActivityListDayContainer } from "@/types/userActivityList";

export const useUserActivityList = () => {
  const api = useApiClient();
  return useQuery<CompactUserActivityListDayContainer[]>({
    queryKey: ["user-activity-list"],
    queryFn: async () => {
      const result = await api<{
        data: CompactUserActivityListDayContainer[];
      }>("/useractivitylist/");
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
