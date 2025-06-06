import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { Mood } from "@/types/mood";

export const useGetMoods = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<Mood[]>({
    queryKey: ["moods"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: Mood[];
      }>(`/moods`);
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
