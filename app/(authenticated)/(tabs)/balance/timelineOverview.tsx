import { adjustLightness } from "@/constants/Colors";
import { textStyles } from "@/globalStyles";
import { ViCustomError } from "@/hooks/apiClient";
import { getPillarInfo, PillarKey, Pillars } from "@/types/activity";
import { StatisticWrapper } from "@/types/statistics";
import { useContext, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
} from "victory-native";
import { BalanceContext } from "./_layout";

export default function TimelineOverview({
  isLoading,
  data,
  error,
  refetch,
}: {
  isLoading: boolean;
  data: StatisticWrapper | undefined;
  error: ViCustomError | null;
  refetch: () => void;
}) {
  const context = useContext(BalanceContext);
  if (!context) return <Text>Loading context...</Text>;
  const { selectedTimespan } = context;

  const groupedData = useMemo(() => {
    if (!data) return {};

    const bins: any = {};

    data.statistics.forEach((item) => {
      const pillar = item.name;
      const rawDate = new Date(item.date);

      let dateKey: string;

      if (selectedTimespan === "month") {
        // Shift to start of week
        const date = new Date(rawDate);
        const day = date.getDay();
        const diffToMonday = (day + 6) % 7;
        date.setDate(date.getDate() - diffToMonday);
        date.setHours(0, 0, 0, 0);
        dateKey = date.toISOString();
      } else if (selectedTimespan === "year") {
        // Shift to start of month
        const date = new Date(rawDate.getFullYear(), rawDate.getMonth(), 1);
        date.setHours(0, 0, 0, 0);
        dateKey = date.toISOString();
      } else {
        // No binning
        const date = new Date(rawDate);
        date.setHours(0, 0, 0, 0);
        dateKey = date.toISOString();
      }

      const duration = parseFloat(item.durationseconds) / 60 / 60;

      if (!bins[pillar]) bins[pillar] = {};
      if (!bins[pillar][dateKey]) bins[pillar][dateKey] = 0;

      bins[pillar][dateKey] += duration;
    });

    // Convert back to Victory-friendly format: array of { x: Date, y: seconds }
    const result: any = {};
    for (const pillar in bins) {
      result[pillar] = Object.entries(bins[pillar]).map(
        ([dateKey, totalDuration]) => ({
          x: new Date(dateKey),
          y: totalDuration, // raw seconds
          fill: Object.entries(Pillars).find(
            ([key, data]) => key == pillar.toLowerCase()
          )?.[1].color,
        })
      );
    }
    //console.log("data changed");
    return result;
  }, [data]);

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
    <FlatList
      data={[{}]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      style={styles.Container}
      renderItem={() => (
        <>
          <VictoryChart
            scale={{ x: "time" }}
            domainPadding={{
              x: [selectedTimespan == "month" ? 20 : 0, 20],
            }}
            padding={40}
          >
            <VictoryStack>
              {Object.entries(groupedData).map(([key, dataGroup]) => {
                return (
                  <VictoryBar
                    barWidth={300 / tickValues.length}
                    data={dataGroup as any}
                    key={key}
                    cornerRadius={{ top: 8, bottom: 8 }}
                    style={{
                      data: {
                        fill: ({ datum }) => datum?.fill,
                      },
                    }}
                  />
                );
              })}
            </VictoryStack>
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={(date) => {
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
              //fixLabelOverlap={true}
              style={{
                tickLabels: { angle: selectedTimespan == "year" ? -45 : 0 },
              }}
            />

            <VictoryAxis
              dependentAxis
              label="Hours"
              tickFormat={(tick) =>
                tick != Math.floor(tick) ? "" : Math.floor(tick)
              }
            />
          </VictoryChart>

          <Text style={textStyles.h3}>Total time per pillar</Text>
          <View
            style={{
              gap: 16,
              paddingTop: 8,
              width: "100%",
            }}
          >
            <View
              style={{
                gap: 16,
                flexDirection: "row",
                width: "100%",
              }}
            >
              <TimelineTile
                pillar={"mindfulness"}
                durationInMinutes={
                  Object.entries(data!.pillarStats).find(
                    ([key, value]) => key.toLowerCase() == "mindfulness"
                  )?.[1] ?? 0
                }
              />
              <TimelineTile
                pillar={"physical"}
                durationInMinutes={
                  Object.entries(data!.pillarStats).find(
                    ([key, value]) => key.toLowerCase() == "physical"
                  )?.[1] ?? 0
                }
              />
            </View>
            <View
              style={{
                gap: 16,

                width: "100%",
                flexDirection: "row",
              }}
            >
              <TimelineTile
                pillar={"social"}
                durationInMinutes={
                  Object.entries(data!.pillarStats).find(
                    ([key, value]) => key.toLowerCase() == "social"
                  )?.[1] ?? 0
                }
              />
              <TimelineTile
                pillar={"skills"}
                durationInMinutes={
                  Object.entries(data!.pillarStats).find(
                    ([key, value]) => key.toLowerCase() == "skills"
                  )?.[1] ?? 0
                }
              />
            </View>
          </View>
        </>
      )}
    />
  );
}

interface timelineTilePorps {
  pillar: PillarKey;
  durationInMinutes: number;
  onPress?: () => void;
}
const TimelineTile = ({
  pillar,
  durationInMinutes,
  onPress,
}: timelineTilePorps) => {
  const pillarDetails = getPillarInfo(pillar);

  return (
    <View style={styles.buttonContainer}>
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={{
            backgroundColor: adjustLightness(pillarDetails.color, 28), // pillarDetails.color + "33",
            height: 96,
            padding: 8,
            borderRadius: 16,
            justifyContent: "space-between",
            borderColor: pillarDetails.color,
            borderWidth: 2,
            width: "100%",
          }}
        >
          <Text
            style={[
              textStyles.bodyLarge,
              {
                color: adjustLightness(pillarDetails.color, -40),
              },
            ]}
          >
            {pillarDetails.title}
          </Text>
          <View
            style={{
              marginStart: "auto",
            }}
          >
            <Text
              style={[
                textStyles.h3,
                {
                  color: adjustLightness(pillarDetails.color, -40),
                },
              ]}
            >
              {durationInMinutes / 60}h
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    //alignItems: "flex-start",
    gap: 8,
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
});
