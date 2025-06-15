import { View, Text } from "react-native";

import { useContext } from "react";
import {
  useGetEnergyOvertime,
  useGetStatisticsPerPillar,
} from "@/hooks/useStatistics";
import { Viloader } from "@/components/ViLoader";
import VitoError from "@/components/ViErrorHandler";
import { BalanceContext } from "./_layout";
import TimelineOverview from "./timelineOverview";
import TimelineEnergy from "./timelineEnergy";
import UnderConstruction from "@/components/ViUnderConstruction";

export default function BalanceScreen() {
  const context = useContext(BalanceContext);
  if (!context) {
    return <Text>Loading context...</Text>;
  }
  const { dateRange, selectedStatisticVariant, selectedTimespan } = context;

  const {
    isLoading: overviewIsLoading,
    data: overviewData,
    error: overviewError,
    refetch: overviewRefresh,
  } = useGetStatisticsPerPillar({
    startDate: dateRange?.start,
    endDate: dateRange?.end,
  });
  const {
    isLoading: energyIsLoading,
    data: energyData,
    error: energyError,
    refetch: energyRefresh,
  } = useGetEnergyOvertime({
    startDate: dateRange?.start,
    endDate: dateRange?.end,
  });

  return (
    <View>
      {overviewIsLoading || energyIsLoading ? (
        <Viloader message="Vito is sorting your activities" />
      ) : null}
      {overviewError ? (
        <VitoError
          error={overviewError}
          loading={overviewIsLoading}
          refetch={overviewRefresh}
        />
      ) : null}
      {energyError ? (
        <VitoError
          error={energyError}
          loading={energyIsLoading}
          refetch={energyRefresh}
        />
      ) : null}
      {selectedStatisticVariant == "overview" &&
      !overviewIsLoading &&
      !overviewError &&
      overviewData ? (
        <TimelineOverview
          data={overviewData}
          error={overviewError}
          isLoading={overviewIsLoading}
          refetch={overviewRefresh}
        />
      ) : null}
      {selectedStatisticVariant == "mood" ? <UnderConstruction /> : null}
      {selectedStatisticVariant == "energy" &&
      !energyIsLoading &&
      !energyError &&
      energyData ? (
        <TimelineEnergy
          data={energyData}
          error={energyError}
          isLoading={energyIsLoading}
          refetch={energyRefresh}
        />
      ) : null}
    </View>
  );
}
