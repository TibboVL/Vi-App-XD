import { ViCustomError } from "@/hooks/apiClient";
import { EnergyStatisticsWrapper } from "@/types/statistics";
import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory-native";
import { BalanceContext } from "./_layout";

export default function TimelineEnergy({
  isLoading,
  data,
  error,
  refetch,
}: {
  isLoading: boolean;
  data: EnergyStatisticsWrapper | undefined;
  error: ViCustomError | null;
  refetch: () => void;
}) {
  const context = useContext(BalanceContext);
  if (!context) return <Text>Loading context...</Text>;
  const { selectedTimespan } = context;

  const [mappedData, setMappedData] = useState<{ x: string; y: number }[]>();
  useEffect(() => {
    if (data) {
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      const newMappedArray = data.statistics
        .filter((stat) => {
          const statDate = new Date(stat.date);
          return statDate >= startDate && statDate <= endDate;
        })
        .map((stat) => ({
          x: new Date(stat.date), // make sure it's a Date object
          y: stat.energy,
        }));

      setMappedData(newMappedArray as any);
    }
  }, [data, selectedTimespan]);

  const tickValues = useMemo(() => {
    if (!data) return [];
    const end = new Date(data.end);
    const start = new Date(data.start);
    const days: Date[] = [];

    const daysToDisplay =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const amountToAdd =
      selectedTimespan == "week" ? 1 : selectedTimespan == "month" ? 7 : 30;
    for (let i = 0; i < daysToDisplay; i += amountToAdd) {
      const tickDate = new Date(start); // copy the original start
      tickDate.setDate(start.getDate() + i);
      days.push(tickDate);
    }
    return days;
  }, [data]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <VictoryChart scale={{ x: "time" }}>
        <VictoryArea
          style={{
            data: {
              stroke: "#2b7fff",
              strokeWidth: 0,
              strokeLinecap: "round",
              fill: "#2b7fff",
              fillOpacity: 0.7,
            },
          }}
          interpolation="basis"
          data={mappedData}
        />
        <VictoryScatter
          data={mappedData}
          style={{
            data: {
              fill: "#372aac",
            },
          }}
        />
        <VictoryAxis
          // fixLabelOverlap={true}
          tickValues={tickValues}
          tickFormat={(strDate) => {
            const date = new Date(strDate); // convert string to Date
            return date.toLocaleString(
              "default",
              selectedTimespan == "week"
                ? {
                    day: "numeric",
                    month: "short",
                  }
                : selectedTimespan == "month"
                ? {
                    day: "numeric",
                  }
                : {
                    month: "short",
                  }
            );
          }}
        />

        <VictoryAxis
          dependentAxis
          label="Energy"
          tickValues={[0, 20, 40, 60, 80, 100]}
          tickFormat={(tick) =>
            tick != Math.floor(tick) ? "" : Math.floor(tick)
          }
        />
      </VictoryChart>
    </ScrollView>
  );
}
