import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Clock, CurrencyEur, MapPin, Users, User } from "phosphor-react-native";
import { router } from "expo-router";
import { Activity, ActivitySuggestion, EnergyLevel } from "@/types/activity";
import { minutesToHoursMinutes } from "@/helpers/dateTimeHelpers";
import { getIconByActivity } from "@/helpers/activityIconHelper";
import { memo, useCallback, useMemo } from "react";
import { TextColors, textStyles } from "@/globalStyles";
import { EnergyIcon } from "./EnergyIcon";
import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { Rect } from "victory-native";
import ViCategoryContainer from "./ViCategoryContainer";
import Tooltip from "rn-tooltip";
import { LinearGradient } from "expo-linear-gradient";

export const ViActivitySuggestion = memo(
  ({
    activity,
    activitySuggestion,
    handleShowPremiumDialog,
  }: {
    activity: Activity;
    activitySuggestion?: ActivitySuggestion;
    handleShowPremiumDialog?: () => void;
  }) => {
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
    if (activitySuggestion) {
      activity.energyRequired = activitySuggestion?.overwriteEnergyRequired;
      activity.isGroupActivity = activitySuggestion?.overwriteIsGroupActivity;
    }

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
        params: {
          activityId,
          title: name,
          suggestedActivityId: activitySuggestion?.suggestedActivityId ?? null,
        },
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
              {activitySuggestion ? (
                <ConfidenceBadge suggestion={activitySuggestion} />
              ) : null}
            </View>
            <ViCategoryContainer
              activity={activity}
              style={{
                marginTop: 0,
              }}
            />

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
                  {estimatedCost > 0 ? estimatedCost?.toString() : "Free"}
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

        {activitySuggestion?.isPremiumLocked ? (
          <TouchableNativeFeedback onPress={handleShowPremiumDialog}>
            <View
              style={[
                styles.blurContainer,
                {
                  backgroundColor: "rgba(255,255,255,1)",
                },
              ]}
            >
              <View style={[styles.blurContainer]}>
                <Text style={[textStyles.h4]}>This is a Premium feature!</Text>
                <Text style={[TextColors.muted]}>
                  Upgrade now to see up to 5 activity suggestions
                </Text>
              </View>
              <Svg height="100%" width="100%">
                <Defs>
                  {/* Purple Radial Gradient */}
                  <RadialGradient
                    id="grad1"
                    cx="35%"
                    cy="0%"
                    rx="150%"
                    ry="150%"
                    fx="35%"
                    fy="0%"
                  >
                    <Stop offset="0%" stopColor="#40E0D0" stopOpacity=".5" />
                    <Stop offset="70%" stopColor="#40E0D0" stopOpacity="0" />
                  </RadialGradient>
                  {/* Blue Radial Gradient */}
                  <RadialGradient
                    id="grad2"
                    cx="75%"
                    cy="100%"
                    rx="150%"
                    ry="150%"
                    fx="75%"
                    fy="100%"
                  >
                    <Stop offset="0%" stopColor="#FF8C00" stopOpacity=".3" />
                    <Stop offset="70%" stopColor="#FF8C00" stopOpacity="0" />
                  </RadialGradient>
                  <RadialGradient
                    id="grad3"
                    cx="95%"
                    cy="100%"
                    rx="150%"
                    ry="150%"
                    fx="15%"
                    fy="100%"
                  >
                    <Stop offset="0%" stopColor="#FF0080" stopOpacity=".2" />
                    <Stop offset="70%" stopColor="#FF0080" stopOpacity="0" />
                  </RadialGradient>
                  {/* Blur Filter */}
                  <Filter
                    id="blurFilter"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <FeGaussianBlur stdDeviation="100" />
                  </Filter>
                </Defs>

                {/* First Radial Gradient with blur */}
                <G filter="url(#blurFilter)">
                  <Rect width="100%" height="100%" fill="url(#grad1)" />
                  <Rect width="100%" height="100%" fill="url(#grad2)" />
                  <Rect width="100%" height="100%" fill="url(#grad3)" />
                </G>
              </Svg>
            </View>
          </TouchableNativeFeedback>
        ) : null}
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
    marginTop: 0,
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

  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const ConfidenceBadge = ({
  suggestion,
}: {
  suggestion: ActivitySuggestion;
}) => {
  if (!suggestion) return null;

  const score = suggestion.confidence * 100;
  const style = confidenceStyles(score);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: 6,
        //maxWidth: 200,
        zIndex: 100,
      }}
    >
      <Tooltip
        actionType="press"
        backgroundColor="#FFF"
        //withOverlay={false}
        overlayColor="rgba(0,0,0,0.1)"
        width={300}
        height={150}
        //withPointer={false}

        containerStyle={{
          //          backgroundColor: "red",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        popover={
          <View>
            <Text>{suggestion.reasoning}</Text>
          </View>
        }
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            [...style.colors] as unknown as readonly [
              string,
              string,
              ...string[]
            ]
          }
          style={{
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            ...style.shadow,
          }}
        >
          <Text
            style={[
              textStyles.bodySmall,
              { color: style.textColor, fontWeight: "600" },
            ]}
          >
            {Math.round(score)}% fit
          </Text>
        </LinearGradient>
      </Tooltip>
    </View>
  );
};
const confidenceStyles = (confidence: number) => {
  if (confidence >= 95) {
    return {
      useGradient: true,
      colors: ["#FFD700", "#FFC107"], // Rich Gold
      textColor: "#3B2E00", // Dark brown text for contrast on gold
      shadow: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
      },
    };
  } else if (confidence >= 90) {
    return {
      useGradient: true,
      colors: ["#FFECB3", "#FFD54F"], // Muted Gold
      textColor: "#5A4D00", // Dark yellow text
      shadow: {
        shadowColor: "#FFD54F",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
    };
  } else if (confidence >= 85) {
    return {
      useGradient: true,
      colors: ["#C0C0C0", "#A9A9A9"], // Silver gradient
      textColor: "#1A1A1A", // Very dark text
      shadow: null,
    };
  } else if (confidence >= 70) {
    return {
      useGradient: true,
      colors: ["#CD7F32", "#B87333"], // Bronze gradient
      textColor: "#3E1F00", // Dark brown text
      shadow: null,
    };
  } else {
    return {
      useGradient: true,
      colors: ["#A9A9A9", "#707070"], // Gray gradient for low confidence
      textColor: "#FFFFFF", // White text
      shadow: null,
    };
  }
};
