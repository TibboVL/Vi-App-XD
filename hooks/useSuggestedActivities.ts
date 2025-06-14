import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { AISuggestionResponse } from "@/types/activity";

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
  return useQuery<AISuggestionResponse>({
    queryKey: ["suggested-activity-list"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: AISuggestionResponse;
      }>(`/activitySuggestions?lon=${lon?.toString()}&lat=${lat?.toString()}`);
      return result.data;
    },
    retry: (failureCount, error) => {
      if (error?.status === 404) {
        return false; // ❌ No retry on not found error
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};
export const useGenerateNewSuggestedActivities = ({
  enabled = true,
  lon,
  lat,
}: {
  enabled?: boolean;
  lon: string | number | undefined;
  lat: string | number | undefined;
}) => {
  const api = useApiClient();
  return useQuery<AISuggestionResponse>({
    queryKey: ["generate-suggested-activity-list"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: AISuggestionResponse;
      }>(
        `/activities/personalized?lon=${lon?.toString()}&lat=${lat?.toString()}`
      );
      return result.data;
    },
    retry: (failureCount, error) => {
      if (error?.status === 503) {
        return false; // ❌ No retry on quota error
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};
