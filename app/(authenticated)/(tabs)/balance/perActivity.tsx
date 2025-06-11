import ViCategoryContainer from "@/components/ViCategoryContainer";
import { adjustLightness } from "@/constants/Colors";
import { TextColors, textStyles } from "@/globalStyles";
import { Activity } from "@/types/activity";
import { useEffect, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundColors } from "../../../../globalStyles";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
} from "victory-native";
import { useGetStatisticsPerActivity } from "@/hooks/useStatistics";
import { ViDivider } from "@/components/ViDivider";
import { RefreshControl } from "react-native-gesture-handler";

interface SectionData {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  color: string;
  title: string;
}

const axisTicks = [-2, -1, 0, 1, 2];

// Area overlays for visual groups
const overlaySections: SectionData[] = [
  {
    x0: 0,
    x1: Math.max(...axisTicks),
    y0: Math.max(...axisTicks),
    y1: 0,
    color: "#009966",
    title: "Energizing & Uplifting",
  }, // top right
  {
    x0: 0,
    x1: Math.max(...axisTicks),
    y0: Math.min(...axisTicks),
    y1: 0,
    color: "#155dfc",
    title: "Calming & Uplifting",
  }, // bottom right
  {
    x0: Math.min(...axisTicks),
    x1: 0,
    y0: Math.max(...axisTicks),
    y1: 0,
    color: "#e17100",
    title: "Stressful & Energizing",
  }, // top left
  {
    x0: Math.min(...axisTicks),
    x1: 0,
    y0: Math.min(...axisTicks),
    y1: 0,
    color: "#52525c",
    title: "Draining & Down",
  }, // bottom left
];

interface ActivityImpactEntry {
  x: number;
  y: number;
  activity: Activity;
}

export default function PerActivityScreen() {
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    setBoundingRect({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const [mappedData, setMappedData] = useState<ActivityImpactEntry[]>();
  const { isLoading, isFetching, data, error, refetch } =
    useGetStatisticsPerActivity({
      // startDate: dateRange?.start,
      // endDate: dateRange?.end,
    });

  useEffect(() => {
    if (data) {
      const mappedData = data.map(
        (d) =>
          ({
            x: d.averageDeltas.combinedDeltaMood,
            y: d.averageDeltas.normalizedDeltaEnergy,
            activity: {
              name: d.activityTitle,
              activityId: d.activityId,
              categories: d.categories,
            },
          } as ActivityImpactEntry)
      );
      setMappedData(mappedData);
    }
  }, [data]);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <Text
          style={[
            textStyles.h3,
            { textAlign: "center" /* backgroundColor: "blue"  */ },
          ]}
        >
          Activity impact
        </Text>
        <View
          onLayout={onLayout}
          style={{
            //width: 400,

            //backgroundColor: "#FF000033",
            aspectRatio: 1,
          }}
        >
          <VictoryChart
            padding={{
              top: 30,
              bottom: 50,
              left: 50,
              right: 30,
            }}
            height={boundingRect.height}
            width={boundingRect.width}
          >
            {overlaySections.map((section, i) => (
              <VictoryArea
                key={i}
                style={{
                  data: {
                    fill: adjustLightness(section.color, 10),
                    stroke: "none",
                    opacity: 0.3,
                  },
                }}
                data={[
                  { x: section.x0, y: section.y0 },
                  { x: section.x1, y: section.y0 },
                ]}
              />
            ))}
            <VictoryScatter data={mappedData}></VictoryScatter>
            <VictoryAxis
              dependentAxis
              domain={[axisTicks[0], axisTicks[axisTicks.length - 1]]}
              offsetX={50}
              tickValues={axisTicks}
              label={"Energy change"}
            />
            <VictoryAxis
              domain={[axisTicks[0], axisTicks[axisTicks.length - 1]]}
              offsetY={50}
              tickValues={axisTicks}
              label={"Mood change"}
            />
          </VictoryChart>
        </View>
        {mappedData ? (
          <View
            style={{
              paddingInline: 16,
              gap: 12,
              marginTop: 6,
            }}
          >
            {overlaySections.map((section, index) => {
              const xMin = Math.min(section.x0, section.x1);
              const xMax = Math.max(section.x0, section.x1);
              const yMin = Math.min(section.y0, section.y1);
              const yMax = Math.max(section.y0, section.y1);

              const sectionPoints = mappedData.filter(
                (point) =>
                  point.x >= xMin &&
                  point.x < xMax &&
                  point.y >= yMin &&
                  point.y < yMax
              );
              return (
                <ActivityImpactSection
                  key={index}
                  sectionData={section}
                  points={sectionPoints}
                />
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

interface ActivityImpactSectionProps {
  sectionData: SectionData;
  points: ActivityImpactEntry[];
}
const ActivityImpactSection = ({
  sectionData,
  points,
}: ActivityImpactSectionProps) => {
  return (
    <View
      style={{
        backgroundColor: adjustLightness(sectionData.color, 20) + "33",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <TouchableNativeFeedback>
        <View
          style={{
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <View
              style={{
                height: 16,
                transform: [{ translateY: 1.5 }],
                aspectRatio: 1,
                backgroundColor: sectionData.color,
                borderRadius: 4,
              }}
            />
            <Text
              style={[
                textStyles.h4,
                { color: adjustLightness(sectionData.color, -10) },
              ]}
            >
              {sectionData.title}
            </Text>
          </View>
          <FlatList
            data={points}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => (
              <ViDivider
                style={{
                  marginBlock: 2,
                  backgroundColor:
                    adjustLightness(sectionData.color, 10) + "44",
                }}
              />
            )}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>{item.activity.name}</Text>
                <ViCategoryContainer activity={item.activity} />
              </View>
            )}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
