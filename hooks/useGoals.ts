import { useQuery, useMutation } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { Goal } from "@/types/goal";

export const useGetGoals = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<Goal[]>({
    queryKey: ["goals"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Goal[];
      }>(`/goals`);
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
export const useGetCurrentGoals = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<Goal[]>({
    queryKey: ["current-goals"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Goal[];
      }>(`/goals/current`);
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};

export const useSetGoals = () => {
  const api = useApiClient();
  return useMutation({
    mutationFn: async ({ goalIds }: { goalIds: number[] }) => {
      const result = await api<{
        data: Goal[];
      }>(`/goals`, {
        method: "POST",
        body: JSON.stringify({
          goalIds: goalIds,
        }),
      });

      return result.data;
    },
  });
};
