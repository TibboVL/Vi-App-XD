import { adjustLightness } from "@/constants/Colors";
import { BackgroundColors, textStyles } from "@/globalStyles";
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
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory-native";
import { useState } from "react";
import { PerActivityStatistics } from "@/types/statistics";
import ViNotificationDot from "@/components/ViNotificationDot";
import { Activity, getPillarInfo, PillarKey } from "@/types/activity";
import {
  ViTable,
  ViTableBody,
  ViTableCell,
  ViTableHeader,
  ViTableHeaderCell,
  ViTableRow,
} from "@/components/ViTable";

interface PerActivityEnergyProps {
  data: PerActivityStatistics[];
}
export default function PerActivityEnergy({ data }: PerActivityEnergyProps) {
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    setBoundingRect({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const mappedData = data
    .map(
      (d, index) =>
        ({
          x: d.activityTitle,
          y: d.averageDeltas.deltaEnergy,
          activity: {
            name: d.activityTitle,
            activityId: d.activityId,
            categories: d.categories,
          },
          basedOnCheckinAmount: d.basedOnCheckinAmount,
        } as ActivityImpactEntry)
    )
    .sort((a, b) => a.y);

  const headers = ["Activity", "Energy"];

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
            bottom: 100,
            left: 80,
            right: 30,
          }}
          domainPadding={15}
          height={boundingRect.height}
          width={boundingRect.width}
        >
          <VictoryLine
            data={[
              { x: mappedData[0].x, y: 0 },
              { x: mappedData[mappedData.length - 1].x, y: 0 },
            ]}
            style={{
              data: {
                stroke: "#888",
                strokeWidth: 1,
                strokeDasharray: "8,8",
              },
            }}
          />
          <VictoryBar
            data={mappedData}
            style={{
              data: {
                fill: ({ datum }) =>
                  adjustLightness(
                    getPillarInfo(
                      datum.activity.categories[0]?.pillar.toLowerCase() as PillarKey
                    )?.color,
                    15
                  ),
              },
            }}
          />
          <VictoryAxis
            tickValues={mappedData.map((d) => d.x)}
            offsetY={100}
            tickLabelComponent={
              <VictoryLabel
                angle={-55}
                textAnchor="end"
                style={{ fontSize: textStyles.bodySmall.fontSize }}
              />
            }
          />
          <VictoryAxis
            dependentAxis
            tickValues={[-100, -50, 0, 50, 100]}
            domain={[-100, 100]}
            offsetX={80}
            label={"Energy"}
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
        {mappedData ? (
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
