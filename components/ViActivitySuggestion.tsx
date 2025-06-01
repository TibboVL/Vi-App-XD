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
  User,
} from "phosphor-react-native";

import { Tag } from "./ViCategoryTag";
import { router } from "expo-router";
import { Activity, EnergyLevel, PillarKey } from "@/types/activity";
import { minutesToHoursMinutes } from "@/helpers/dateTimeHelpers";
import { getIconByActivity } from "@/helpers/activityIconHelper";
import { memo, useCallback, useMemo } from "react";
import { TextColors, textStyles } from "@/globalStyles";
import { EnergyIcon } from "./EnergyIcon";

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
      distance,
    } = activity;

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
                style={[textStyles.bodyLarge, { flexShrink: 1 }]}
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
              <Text>No categories - this shouldnt happen!</Text>
            )}

            <View style={styles.details}>
              <View style={styles.detail}>
                <EnergyIcon energy={energyRequired} size={20} />
                <Text style={textStyles.bodySmall}>{energyLevelLabel}</Text>
              </View>

              <View style={styles.detail}>
                <Clock size={20} />
                <Text style={textStyles.bodySmall}>
                  {estimatedDurationMinutes > 0
                    ? (hours !== 0 ? `${hours}h ` : "") + `${minutes}m`
                    : "N/A"}
                </Text>
              </View>

              <View style={styles.detail}>
                <CurrencyEur size={20} />
                <Text style={textStyles.bodySmall}>
                  {estimatedCost > 0 ? estimatedCost.toString() : "Free"}
                </Text>
              </View>

              <View style={styles.detail}>
                <MapPin size={20} />
                <Text style={textStyles.bodySmall}>
                  {distance ? `${distance}km` : "Any"}
                </Text>
              </View>

              <View style={styles.detail}>
                {isGroupActivity ? <Users size={20} /> : <User size={20} />}
                <Text style={textStyles.bodySmall}>
                  {isGroupActivity ? "Group" : "Alone"}
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
    gap: 4,
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    color: TextColors.muted.color,
  },
  tagsContainer: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
});
