import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";
import {
  EnergyStatisticsWrapper,
  PerActivityStatistics,
  StatisticWrapper,
} from "@/types/statistics";

export const useGetStatisticsPerPillar = ({
  enabled = true,
  startDate,
  endDate,
}: {
  enabled?: boolean;
  startDate?: Date;
  endDate?: Date;
} = {}) => {
  const api = useApiClient();
  return useQuery<StatisticWrapper>({
    queryKey: ["statistics-per-pillar", startDate, endDate], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: StatisticWrapper;
      }>(
        `/statistics/timelinePillar?${
          startDate ? "startDate=" + startDate.toISOString() : null
        }${endDate ? "&endDate=" + endDate.toISOString() : null}`
      );
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
export const useGetEnergyOvertime = ({
  enabled = true,
  startDate,
  endDate,
}: {
  enabled?: boolean;
  startDate?: Date;
  endDate?: Date;
} = {}) => {
  const api = useApiClient();
  return useQuery<EnergyStatisticsWrapper>({
    queryKey: ["statistics-energy-overtime", startDate, endDate], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: EnergyStatisticsWrapper;
      }>(
        `/statistics/timelineEnergy?${
          startDate ? "startDate=" + startDate.toISOString() : null
        }${endDate ? "&endDate=" + endDate.toISOString() : null}`
      );
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
export const useGetStatisticsPerActivity = ({
  enabled = true,
  startDate,
  endDate,
}: {
  enabled?: boolean;
  startDate?: Date;
  endDate?: Date;
} = {}) => {
  const api = useApiClient();
  return useQuery<PerActivityStatistics[]>({
    queryKey: ["statistics-per-activity", startDate, endDate], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: PerActivityStatistics[];
      }>(
        `/statistics/perActivity?${
          startDate ? "startDate=" + startDate.toISOString() : null
        }${endDate ? "&endDate=" + endDate.toISOString() : null}`
      );
      return result.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: enabled,
  });
};
