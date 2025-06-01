import { adjustLightness } from "@/constants/Colors";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryChart,
  VictoryHistogram,
  VictoryStack,
} from "victory-native";
import { textStyles } from "@/globalStyles";
import _ from "lodash";
import { useState } from "react";
import { ViSelect } from "@/components/ViSelect";
import { getPillarInfo, PillarKey, Pillars } from "@/types/activity";

const today = new Date();
const rawDow = today.getDay(); // 0–6
const isoDow = rawDow === 0 ? 7 : rawDow; // 1–7
// how many days to subtract
const daysSinceMonday = isoDow - 1;

// year, month (0–11), day-of-month
const prevMonday = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - daysSinceMonday
);
// zero out hours/mins/secs/ms
prevMonday.setHours(0, 0, 0, 0);

const oneWeekLater = new Date(prevMonday.getTime() + 7 * 24 * 60 * 60 * 1000);
oneWeekLater.setHours(23, 59, 0, 0);

// Convert object to array of entries for random access
const pillarsArray = Object.values(Pillars); // [{ title, color }, ...]

const pillarData = [];
for (let i = 0; i < 100; i++) {
  const randomDate = new Date(
    _.random(prevMonday.getTime(), oneWeekLater.getTime())
  );
  const randomPillar = _.sample(pillarsArray)!; // get random pillar

  pillarData.push({
    date: randomDate,
    day: randomDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    pillar: randomPillar.title,
  });
}

const groupedData = _.groupBy(pillarData, ({ pillar }) => pillar);

type TimespanOption = "day" | "week" | "month" | "year";
const timespanOptions: { label: string; value: TimespanOption }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export default function BalanceScreen() {
  const [selectedTimespan, setSelectedTimespan] =
    useState<TimespanOption>("week");

  return (
    <SafeAreaView>
      <View style={styles.Container}>
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
        <VictoryChart scale={{ x: "time" }}>
          <VictoryStack
            colorScale={pillarsArray.map((p) => p.color)} // Use colors in order of pillarsArray
          >
            {Object.entries(groupedData).map(([key, dataGroup]) => {
              return (
                <VictoryHistogram
                  data={dataGroup as any}
                  key={key}
                  x="date"
                  bins={7} // ← force ~7 bins
                  binSpacing={8}
                  cornerRadius={6}
                  style={{
                    data: {
                      borderRadius: 16,

                      strokeWidth: 1,
                    },
                  }}
                />
              );
            })}
          </VictoryStack>
          <VictoryAxis
            tickCount={7}
            tickFormat={(date) =>
              date.toLocaleString("default", { weekday: "narrow" })
            }
          />

          <VictoryAxis dependentAxis /* label="# Activities per pillar" */ />
        </VictoryChart>
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
            <TimelineTile pillar={"mindfulness"} durationInMinutes={60 * 8} />
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
      </View>
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
    alignItems: "flex-start",
    gap: 8,
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
});
