import ViCategoryContainer from "@/components/ViCategoryContains";
import { adjustLightness } from "@/constants/Colors";
import { TextColors, textStyles } from "@/globalStyles";
import { Activity } from "@/types/activity";
import { useState } from "react";
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

interface SectionData {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  color: string;
  title: string;
}
// Area overlays for visual groups
const overlaySections: SectionData[] = [
  {
    x0: 0,
    x1: 3,
    y0: 3,
    y1: 0,
    color: "#009966",
    title: "Energizing & Uplifting",
  }, // top right
  {
    x0: 0,
    x1: 3,
    y0: -3,
    y1: 0,
    color: "#155dfc",
    title: "Calming & Uplifting",
  }, // bottom right
  {
    x0: -3,
    x1: 0,
    y0: 3,
    y1: 0,
    color: "#e17100",
    title: "Stressful & Energizing",
  }, // top left
  { x0: -3, x1: 0, y0: -3, y1: 0, color: "#52525c", title: "Draining & Down" }, // bottom left
];

interface ActivityImpactEntry {
  x: number;
  y: number;
  activity: Activity;
}

const temporaryChartData: ActivityImpactEntry[] = [
  {
    x: -1,
    y: 1,
    activity: {
      name: "abc",
      activityId: 1,
      categories: [
        {
          activityCategoryId: 32,
          name: "clean",
          pillar: "Physical",
        },
        {
          activityCategoryId: 33,
          name: "organize",
          pillar: "Skills",
        },
      ],
    } as Activity,
  },
  {
    x: 2,
    y: 2,
    activity: {
      name: "abc",
      activityId: 1,
    } as Activity,
  },
  {
    x: -3,
    y: 2,
    activity: {
      name: "abc",
      activityId: 1,
    } as Activity,
  },
  {
    x: 1,
    y: -2,
    activity: {
      name: "abc",
      activityId: 1,
    } as Activity,
  },
  {
    x: -1,
    y: -1.5,
    activity: {
      name: "abc",
      activityId: 1,
    } as Activity,
  },
];

export default function PerActivityScreen() {
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    setBoundingRect({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
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
            <VictoryScatter data={temporaryChartData}></VictoryScatter>
            <VictoryAxis
              dependentAxis
              domain={[-3, 3]}
              offsetX={50}
              tickValues={[-3, -2, -1, 0, 1, 2, 3]}
              label={"Energy change"}
            />
            <VictoryAxis
              domain={[-3, 3]}
              offsetY={50}
              tickValues={[-3, -2, -1, 0, 1, 2, 3]}
              label={"Mood change"}
            />
          </VictoryChart>
        </View>
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

            const sectionPoints = temporaryChartData.filter(
              (point) =>
                point.x >= xMin &&
                point.x <= xMax &&
                point.y >= yMin &&
                point.y <= yMax
            );
            return (
              <ActivityImpactSection
                sectionData={section}
                points={sectionPoints}
              />
            );
          })}
        </View>
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
        backgroundColor: adjustLightness(sectionData.color, 20) + "44",
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
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
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
