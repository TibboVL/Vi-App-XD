import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { ActivityDetails } from "@/types/activity";

export const useGetActivityDetails = ({
  enabled = true,
  activityId,
}: {
  enabled?: boolean;
  activityId: string | number;
}) => {
  const api = useApiClient();
  return useQuery<ActivityDetails>({
    queryKey: ["activity-details", activityId], // refresh if id changes  //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: ActivityDetails;
      }>(`/activities/${activityId}`);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled,
  });
};
