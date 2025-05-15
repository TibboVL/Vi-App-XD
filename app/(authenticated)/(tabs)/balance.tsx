import { pillarColors } from "@/constants/Colors";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryChart,
  VictoryHistogram,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryStack,
  VictoryVoronoiContainer,
} from "victory-native";
const globStyles = require("../../../globalStyles");
import _ from "lodash";

const startDate = new Date("2020-01-01T00:00:00.000Z");
const endDate = new Date("2020-01-07T11:59:59.000Z");

// Convert object to array of entries for random access
const pillarsArray = Object.values(pillarColors); // [{ title, color }, ...]

const listeningData = Array.from({ length: 100 }, () => {
  const randomDate = new Date(_.random(startDate.getTime(), endDate.getTime()));
  const randomPillar = _.sample(pillarsArray)!; // get random pillar

  return {
    date: randomDate,
    day: randomDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    pillar: randomPillar.title,
  };
});

// Example: Group by day, then by pillar for stacked bar histogram
// const groupByDate = _.groupBy(listeningData, "day");

const groupedData = _.groupBy(listeningData, ({ pillar }) => pillar);

console.log("Dates:", Object.entries(groupedData).length);
const genres = ["pop", "rap", "hip-hop", "r&b", "indie", "alternative"];

const L = [];
for (let i = 0; i < 100; i++) {
  L.push({
    day: new Date(_.random(startDate.getTime(), endDate.getTime())),
    genre: genres[_.random(0, genres.length - 1)],
  });
}

const G = _.groupBy(L, ({ genre }) => genre);
console.log("Mine:", groupedData);
console.log("G:", G);
export default function BalanceScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <VictoryChart
          scale={{ x: "time" }}
          containerComponent={
            <VictoryVoronoiContainer
              style={{}}
              /*  labels={({ datum }) =>
                datum.y > 0
                  ? `${datum.y} ${datum.binnedData[0].genre} songs`
                  : null
              } */
            />
          }
        >
          <VictoryStack
            colorScale={pillarsArray.map((p) => p.color)} // Use colors in order of pillarsArray
          >
            {Object.entries(groupedData).map(([key, dataGroup]) => {
              console.log("Datagroup:", dataGroup);
              return (
                <VictoryHistogram
                  data={dataGroup as any}
                  key={key}
                  x="date"
                  binSpacing={8}
                  style={{
                    data: {
                      strokeWidth: 0,
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
        </VictoryChart>
        {/* <VictoryPie
          innerRadius={50}
          cornerRadius={12}
          padAngle={2}
          data={[
            { x: "Sports", y: 30 },
            { x: "Mindfullness", y: 35 },
            { x: "Connections", y: 25 },
            { x: "Skills", y: 10 },
          ]}
          width={375}
          height={375}
          style={{
            data: {
              fill: ({ index }) => {
                const numIndex = Number(index) + 1;

                // Optional: validate it's a valid key (1–4)
                if (!(numIndex in pillarColors)) {
                  return "#000";
                }

                return pillarColors[numIndex].color;
              },
            },
            labels: {
              display: "none",
            },
          }}
        /> */}

        <Text style={globStyles.h2}>Your activities</Text>
        <View>
          <TimelineTile pillar={1} duration={60 * 8} />
          <TimelineTile pillar={2} duration={60 * 11} />
          <TimelineTile pillar={3} duration={60 * 20} />
          <TimelineTile pillar={4} duration={60 * 9} />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface timelineTilePorps {
  pillar: number;
  duration: number;

  onPress?: () => void;
}
const TimelineTile = ({ pillar, duration, onPress }: timelineTilePorps) => {
  const pillarDetails = pillarColors[pillar];

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: 16,
      }}
    >
      <View
        style={{
          backgroundColor: pillarDetails.color,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Text style={globStyles.bodyLarge}>{pillarDetails.title}</Text>
        <Text style={globStyles.h3}>{duration}</Text>
      </View>
    </Pressable>
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
});
