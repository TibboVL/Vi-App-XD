import { adjustLightness } from "@/constants/Colors";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
} from "victory-native";
import { textStyles } from "@/globalStyles";
import { useEffect, useMemo, useState } from "react";
import { ViSelect } from "@/components/ViSelect";
import { getPillarInfo, PillarKey, Pillars } from "@/types/activity";
import { useGetStatisticsPerPillar } from "@/hooks/useStatistics";
import { RefreshControl } from "react-native-gesture-handler";

type TimespanOption = "week" | "month" | "year";
const timespanOptions: { label: string; value: TimespanOption }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export default function BalanceScreen() {
  const [selectedTimespan, setSelectedTimespan] =
    useState<TimespanOption>("week");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>();

  useEffect(() => {
    if (selectedTimespan) {
      const now = new Date();

      let start: Date;
      let end: Date;

      switch (selectedTimespan) {
        case "week":
          // Start = Monday of current week
          start = new Date(now);
          const day = start.getDay(); // 0 (Sun) to 6 (Sat)
          const diffToMonday = (day + 6) % 7; // Shift Sunday (0) to last
          start.setDate(start.getDate() - diffToMonday);
          start.setHours(0, 0, 0, 0);

          end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;

        case "month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
          end.setHours(23, 59, 59, 999);
          break;

        case "year":
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          end.setHours(23, 59, 59, 999);
          break;

        default:
          console.error("Something went wrong when changing timespan");
          return;
      }

      setDateRange({ start, end });
    }
  }, [selectedTimespan]);

  const { isLoading, data, error, refetch } = useGetStatisticsPerPillar({
    startDate: dateRange?.start,
    endDate: dateRange?.end,
  });
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
    console.log("data changed");
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
    console.log(days);
    return days;
  }, [data]);
  return (
    <SafeAreaView>
      <FlatList
        data={[{}]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        style={styles.Container}
        renderItem={() => (
          <>
            <View
              style={{
                paddingTop: 8,
              }}
            >
              <ViSelect
                variant="secondary"
                selectedValue={selectedTimespan}
                onValueChange={(itemValue) => setSelectedTimespan(itemValue)}
                options={timespanOptions}
              />
            </View>
            {!isLoading && data && groupedData ? (
              <VictoryChart
                scale={{ x: "time" }}
                domainPadding={{
                  x: [selectedTimespan == "month" ? 20 : 0, 20],
                }}
                padding={40}
              >
                <VictoryStack>
                  {Object.entries(groupedData).map(([key, dataGroup]) => {
                    console.log(key, dataGroup);
                    return (
                      <VictoryBar
                        barWidth={300 / tickValues.length}
                        data={dataGroup as any}
                        key={key}
                        cornerRadius={{ top: 8, bottom: 8 }}
                        style={{
                          data: {
                            fill: ({ datum }) => datum?.fill,
                            //strokeLinejoin: "round",
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
            ) : null}
            <Text style={textStyles.h2}>Your activities</Text>
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
                  durationInMinutes={60 * 8}
                />
                <TimelineTile pillar={"physical"} durationInMinutes={60 * 11} />
              </View>
              <View
                style={{
                  gap: 16,

                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <TimelineTile pillar={"social"} durationInMinutes={60 * 20} />
                <TimelineTile pillar={"skills"} durationInMinutes={60 * 9} />
              </View>
            </View>
          </>
        )}
      />
    </SafeAreaView>
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
