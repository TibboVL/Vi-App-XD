import { adjustLightness } from "@/constants/Colors";
import { textStyles } from "@/globalStyles";
import {
  FlatList,
  LayoutChangeEvent,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { ViDivider } from "../../../../components/ViDivider";
import ViCategoryContainer from "@/components/ViCategoryContainer";
import { ActivityImpactEntry } from "./perActivity";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
} from "victory-native";
import { useState } from "react";
import { PerActivityStatistics } from "@/types/statistics";
import ViNotificationDot from "@/components/ViNotificationDot";
import { getPillarInfo, PillarKey } from "@/types/activity";
import {
  ViTable,
  ViTableBody,
  ViTableCell,
  ViTableHeader,
  ViTableHeaderCell,
  ViTableRow,
} from "@/components/ViTable";

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

interface PerActivityOverviewProps {
  data: PerActivityStatistics[];
  mode: "overview" | "mood";
}
export default function PerActivityOverview({
  data,
  mode = "overview",
}: PerActivityOverviewProps) {
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    setBoundingRect({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const mappedData = data
    .map(
      (d) =>
        ({
          x:
            mode == "overview"
              ? d.averageDeltas.combinedDeltaMood
              : d.averageDeltas.deltaAlertness,
          y:
            mode == "overview"
              ? d.averageDeltas.normalizedDeltaEnergy
              : d.averageDeltas.deltaEnjoyment,
          activity: {
            name: d.activityTitle,
            activityId: d.activityId,
            categories: d.categories,
          },
          basedOnCheckinAmount: d.basedOnCheckinAmount,
        } as ActivityImpactEntry)
    )
    .sort((a, b) => a.x as number);

  const headers = ["Activity", "Alertness", "Enjoyment"];

  return (
    <View>
      <View
        onLayout={onLayout}
        style={{
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
            label={mode == "overview" ? "Energy change" : "Alertness"}
          />
          <VictoryAxis
            domain={[axisTicks[0], axisTicks[axisTicks.length - 1]]}
            offsetY={50}
            tickValues={axisTicks}
            label={mode == "overview" ? "Mood change" : "Enjoyment"}
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
        {mappedData && mode == "overview"
          ? overlaySections.map((section, index) => {
              const xMin = Math.min(section.x0, section.x1);
              const xMax = Math.max(section.x0, section.x1);
              const yMin = Math.min(section.y0, section.y1);
              const yMax = Math.max(section.y0, section.y1);

              const sectionPoints = mappedData.filter(
                (point) =>
                  (point.x as number) >= xMin &&
                  (point.x as number) < xMax &&
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
            })
          : null}
        {mappedData && mode == "mood" ? (
          <ViTable>
            <ViTableHeader>
              {headers.map((header, index) => (
                <ViTableHeaderCell key={index} flex={index === 0 ? 2.5 : 1}>
                  {header}
                </ViTableHeaderCell>
              ))}
            </ViTableHeader>
            <ViTableBody>
              {mappedData.map((row, rowIndex) => {
                const pillarKey =
                  row.activity?.categories[0]?.pillar.toLowerCase() as PillarKey;
                const bgColor = adjustLightness(
                  getPillarInfo(pillarKey)?.color,
                  15
                );
                return (
                  <ViTableRow key={rowIndex} backgroundColor={bgColor}>
                    <ViTableCell flex={2.5}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <ViNotificationDot
                          content={`${row.basedOnCheckinAmount}x`}
                          styles={{ width: 18, height: 18 }}
                        />
                        <Text>{row.activity.name}</Text>
                      </View>
                    </ViTableCell>
                    <ViTableCell>
                      <Text>{Math.round((row.x as number) * 1000) / 1000}</Text>
                    </ViTableCell>
                    <ViTableCell>
                      <Text>{Math.round((row.y as number) * 1000) / 1000}</Text>
                    </ViTableCell>
                  </ViTableRow>
                );
              })}
            </ViTableBody>
          </ViTable>
        ) : null}
      </View>
    </View>
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ViNotificationDot
                    styles={{
                      marginTop: 2,
                      backgroundColor:
                        adjustLightness(sectionData.color, 0) + "44",
                      width: 18,
                      height: 18,
                      color: adjustLightness(sectionData.color, -10),
                    }}
                    content={item.basedOnCheckinAmount + "x"}
                  />
                  <Text>{item.activity.name}</Text>
                </View>
                <ViCategoryContainer activity={item.activity} />
              </View>
            )}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
