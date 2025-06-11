import { Activity } from "@/types/activity";
import { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import { useGetStatisticsPerActivity } from "@/hooks/useStatistics";
import { RefreshControl } from "react-native-gesture-handler";
import { BalanceContext } from "./_layout";
import PerActivityOverview from "./perActivityOverview";
import PerActivityEnergy from "./perActivityEnergy";

export interface ActivityImpactEntry {
  x: number | string;
  y: number;
  activity: Activity;
  basedOnCheckinAmount: number;
}

export default function PerActivityScreen() {
  const context = useContext(BalanceContext);
  if (!context) {
    return <Text>Loading context...</Text>;
  }
  const { dateRange, selectedTimespan, selectedStatisticVariant } = context;
  const { isLoading, isFetching, data, error, refetch } =
    useGetStatisticsPerActivity({
      startDate: dateRange?.start,
      endDate: dateRange?.end,
    });

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {!isLoading && !error && data ? (
          selectedStatisticVariant == "overview" ? (
            <PerActivityOverview data={data} mode="overview" />
          ) : selectedStatisticVariant == "mood" ? (
            <PerActivityOverview data={data} mode="mood" />
          ) : (
            <PerActivityEnergy data={data} />
          )
        ) : null}
      </ScrollView>
    </View>
  );
}
