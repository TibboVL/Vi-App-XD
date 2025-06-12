import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { Plan, Subscription } from "@/types/subscription";

export const useGetActiveSubscription = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<Subscription>({
    queryKey: ["get-active-subscription"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Subscription;
      }>(`/subscription`);
      return result.data;
    },
    staleTime: 0, // 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
export const useGetAvalablePlans = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<Plan[]>({
    queryKey: ["get-available-plans"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Plan[];
      }>(`/subscription/plans`);
      return result.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: enabled,
  });
};

export const useChangePlan = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({ planId }: { planId: number | string }) => {
      const result = await api<{
        data: Subscription;
      }>(`/subscription`, {
        method: "POST",
        body: JSON.stringify({
          planId: planId,
        }),
      });

      return result.data;
    },
  });
};
