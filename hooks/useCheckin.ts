import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import { CurrentCheckin } from "@/types/checkin";

export const useGetLastValidCheckin = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<CurrentCheckin>({
    queryKey: ["last-valid-checkin"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: CurrentCheckin;
      }>(`/checkin/lastValidCheckin`);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5m
    enabled: enabled,
  });
};
