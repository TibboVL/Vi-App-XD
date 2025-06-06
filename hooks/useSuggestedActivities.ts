import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { ActivitySuggestion } from "@/types/activity";

export const useGetSuggestedActivities = ({
  enabled = true,
  lon,
  lat,
}: {
  enabled?: boolean;
  lon: string | number | undefined;
  lat: string | number | undefined;
}) => {
  const api = useApiClient();
  return useQuery<ActivitySuggestion[]>({
    queryKey: ["suggested-activity-list"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: ActivitySuggestion[];
      }>(`/activitySuggestions?lon=${lon?.toString()}&lat=${lat?.toString()}`);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};
