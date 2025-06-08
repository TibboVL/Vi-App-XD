import { ViButton } from "@/components/ViButton";
import { TextColors, textStyles } from "@/globalStyles";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { EnergyLevel, EnergyMappings } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import { useGetLastValidCheckin } from "@/hooks/useCheckin";
import {
  VitoAnimatedMoodHandles,
  VitoAnimatedMoods,
  VitoEmoteConfig,
} from "@/components/VitoAnimatedMoods";
import { ViWave } from "@/components/ViWave";
import { useSharedValue } from "react-native-reanimated";
const batteryColors = {
  low: "#FF707070",
  medium: "#FFBA7070",
  high: "#C8FF7070",
  veryHigh: "#70FFD770",
};
export default function MoodScreen() {
  const [daysAgo, setDaysAgo] = useState<number | null>(null);
  const emoteManagerRef = useRef<VitoAnimatedMoodHandles>(null);
  const battery = useSharedValue(0.1);
  const {
    isLoading,
    data: lastKnownValidCheckin,
    error,
  } = useGetLastValidCheckin();

  function getDaysAgo(checkinDateString: string | null) {
    if (!checkinDateString) return null;
    const checkinDate = new Date(checkinDateString);
    const now = new Date();
    const diffTime = now.getTime() - checkinDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function mapEnergyToFriendly() {
    return lastKnownValidCheckin
      ? Object.entries(EnergyLevel)
          .find(
            (energyLevel) =>
              energyLevel[0] ==
              Object.entries(EnergyMappings).find(([key, value]) => {
                if (
                  lastKnownValidCheckin.energy >= value.min &&
                  lastKnownValidCheckin?.energy <= value.max
                ) {
                  return key;
                }
                return;
              })?.[0]
          )?.[1]
          .toLowerCase()
      : null;
  }

  useEffect(() => {
    const parentMood =
      lastKnownValidCheckin?.parentMood?.toLowerCase() as keyof VitoEmoteConfig;
    emoteManagerRef.current?.setMood(parentMood ?? "Happy");
    battery.value = lastKnownValidCheckin
      ? lastKnownValidCheckin.energy / 100
      : 0.1;
    console.log(battery.value);
    if (lastKnownValidCheckin?.validAtDate) {
      setDaysAgo(getDaysAgo(lastKnownValidCheckin.validAtDate));
    }
  }, [lastKnownValidCheckin]);

  function handleStartCheckin() {
    router.push("/mood/moodPicker");
  }

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={[
          {
            zIndex: 0,
            pointerEvents: "none",
            height: "100%",
            marginTop: insets.top,
          },
          styles.WaveContainerStyles,
        ]}
      >
        <ViWave
          fillPercent={battery}
          baseAmplitude={15}
          baseFrequency={1}
          colors={batteryColors}
        />
      </View>
      <View style={styles.Container}>
        {!isLoading ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              //backgroundColor: "red",
              paddingBlock: 64,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                //backgroundColor: "red",
              }}
            >
              <VitoAnimatedMoods ref={emoteManagerRef} />
            </View>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              Last time you checked in you were feeling
            </Text>
            <Text
              style={[
                textStyles.h4,
                {
                  textAlign: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: 800,
                }}
              >
                {lastKnownValidCheckin?.mood.toLowerCase()}
              </Text>{" "}
              with a{" "}
              <Text
                style={{
                  fontWeight: 800,
                }}
              >
                {mapEnergyToFriendly()}
              </Text>{" "}
              energy level.
            </Text>
          </View>
        ) : (
          <Viloader message="Vito is reading your checkin history!" />
        )}
      </View>
      <View style={styles.BottomContainer}>
        <View
          style={{
            paddingBlock: 32,
            position: "absolute",
            flex: 1,
            //backgroundColor: "red",
            bottom: 64 + 16 + 64,
            left: 0,
            right: 0,
          }}
        >
          {daysAgo && daysAgo != 0 ? (
            <View>
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                    display: daysAgo ?? 0 > 0 ? "flex" : "none",
                  },
                ]}
              >
                Your last check-in was{" "}
                <Text
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {daysAgo} day
                  {daysAgo > 1 ? "s" : ""}
                </Text>{" "}
                ago.
              </Text>
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                    display: daysAgo ?? 0 > 0 ? "flex" : "none",
                  },
                ]}
              >
                A new check-in helps Vi give better suggestions.
              </Text>
            </View>
          ) : (
            <View
              style={{
                display: daysAgo == 0 ? "flex" : "none",
              }}
            >
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                Still feel the same, or has it changed?
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            gap: 8,
          }}
        >
          <ViButton
            type="text-only"
            title="Review activities"
            onPress={() => {
              router.push("/mood/activityReview");
            }}
          />
          <ViButton
            title={
              daysAgo == 0 ? "Update todays check-in" : "Start daily check-in"
            }
            onPress={handleStartCheckin}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "column",
    width: "100%",
    display: "flex",
    gap: 8,
  },
  WaveContainerStyles: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
