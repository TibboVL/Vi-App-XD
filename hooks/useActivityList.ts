import { useQuery } from "@tanstack/react-query";
import { useApiClient, ViCustomError } from "./apiClient";
import { Activity } from "@/types/activity";

export const useGetActivityList = ({
  enabled = true,
  lon,
  lat,
}: {
  enabled?: boolean;
  lon: string | number | undefined;
  lat: string | number | undefined;
}) => {
  const api = useApiClient();
  return useQuery<Activity[]>({
    queryKey: ["activity-list"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Activity[];
      }>(`/activities?lon=${lon?.toString()}&lat=${lat?.toString()}`);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};
