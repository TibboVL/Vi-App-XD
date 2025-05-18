import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";

import {
  BatteryLow,
  BatteryMedium,
  BatteryHigh,
  Clock,
  CurrencyEur,
  MapPin,
  Users,
  BatteryFull,
} from "phosphor-react-native";

import { Tag } from "./ViCategoryTag";
import { router } from "expo-router";
import { Activity, EnergyLevel, PillarKey } from "@/types/activity";
import { minutesToHoursMinutes } from "@/helpers/dateTimeHelpers";
import { getIconByActivity } from "@/helpers/activityIconHelper";
import { memo, useCallback, useMemo } from "react";

const globStyles = require("../globalStyles");

export const ViActivitySuggestion = memo(
  ({ activity }: { activity: Activity }) => {
    // later we replace this with an ID from the DB so we can pass the activity between screens
    const {
      name,
      categories,
      energyRequired,
      estimatedDurationMinutes,
      estimatedCost,
      isGroupActivity,
      activityId,
      debugUITId,
    } = activity;

    // memoize for performance
    const energyLevelIcon = useMemo(() => {
      switch (energyRequired.toLowerCase()) {
        case EnergyLevel.Low:
          return <BatteryLow size={16} />;
        case EnergyLevel.Medium:
          return <BatteryMedium size={16} />;
        case EnergyLevel.High:
          return <BatteryHigh size={16} />;
        case EnergyLevel.VeryHigh:
          return <BatteryFull size={16} />;
        default:
          return <BatteryLow size={16} />;
      }
    }, [energyRequired]);

    const energyLevelLabel = useMemo(() => {
      return (
        Object.entries(EnergyLevel).find(
          ([, value]) => value?.toLowerCase() === energyRequired?.toLowerCase()
        )?.[0] ?? ""
      );
    }, [energyRequired]);

    const { hours, minutes } = useMemo(() => {
      return minutesToHoursMinutes(estimatedDurationMinutes);
    }, [estimatedDurationMinutes]);

    const Icon = useMemo(() => getIconByActivity(activity), [activity]);

    const handlePress = useCallback(() => {
      router.push({
        pathname: "/discover/[activityId]",
        params: { activityId, title: name, debugUITId },
      });
    }, [activityId, name, debugUITId]);

    return (
      <View style={styles.wrapper}>
        <TouchableNativeFeedback onPress={handlePress}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Icon size={32} />
              <Text
                style={[globStyles.bodyLarge, { flexShrink: 1 }]}
                numberOfLines={2}
              >
                {name}
              </Text>
            </View>

            {categories.length > 0 ? (
              <View style={styles.tagsContainer}>
                {categories.map((category) => (
                  <Tag
                    key={category.name}
                    label={category.name}
                    pillar={category.pillar?.toLowerCase() as PillarKey}
                  />
                ))}
              </View>
            ) : (
              <Text>"Pillar not found"</Text>
            )}

            <View style={styles.details}>
              <View style={styles.detail}>
                {energyLevelIcon}
                <Text style={globStyles.bodySmall}>{energyLevelLabel}</Text>
              </View>

              <View style={styles.detail}>
                <Clock size={16} />
                <Text style={globStyles.bodySmall}>
                  {(hours !== 0 ? `${hours}h ` : "") + `${minutes}m`}
                </Text>
              </View>

              <View style={styles.detail}>
                <CurrencyEur size={16} />
                <Text style={globStyles.bodySmall}>
                  {estimatedCost > 0 ? estimatedCost.toString() : "free"}
                </Text>
              </View>

              <View style={styles.detail}>
                <MapPin size={16} />
                <Text style={globStyles.bodySmall}>5 km</Text>
              </View>

              <View style={styles.detail}>
                <Users size={16} />
                <Text style={globStyles.bodySmall}>
                  {isGroupActivity ? "with friends" : "alone"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // shrink if needed
    width: "100%", // expand as much as possible
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  details: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detail: {
    marginBottom: 4,
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  tagsContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
});
