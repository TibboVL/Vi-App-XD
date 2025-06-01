import { ViButton } from "@/components/ViButton";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  ToastAndroid,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
} from "../../../../globalStyles";
import { ViWave } from "@/components/ViWave";
import { router, useNavigation } from "expo-router";
import {
  CheckinContextAction,
  ReviewStage,
  useCheckinDispatch,
  useCheckinState,
} from "./checkinContext";
import ContextDebugView from "./checkinContextDebug";
import { ReText } from "react-native-redash";

const batteryColors = [
  { low: "#FFA3A3", medium: "#f7cf9d", high: "#D4FF8F", veryHigh: "#A3FFE5" },
  { low: "#FF7070", medium: "#FFBA70", high: "#C8FF70", veryHigh: "#70FFD7" },
  { low: "#FF1F1F", medium: "#FFA340", high: "#A7DF4E", veryHigh: "#2FA785" },
];

export default function EnergyPickerScreen() {
  const state = useCheckinState();
  const dispatch = useCheckinDispatch();
  const navigation = useNavigation();

  const [batteryContainerHeight, setBatteryContainerHeight] = useState(500);
  const insets = useSafeAreaInsets();

  const fillLayerOffset = 0.035;
  const fill = useSharedValue(0.15); // 0 to 1
  const fillAbove = useSharedValue(0.15 + fillLayerOffset); // 0 to 1
  const fillBelow = useSharedValue(0.15 - fillLayerOffset); // 0 to 1

  // const [displayedPercentage, setDisplayedPercentage] = useState(15);

  const handleContinue = () => {
    // if we are reviewing an activity and in the before state then go to the after state, dont go to the review page
    if (state.reviewStage == ReviewStage.BEFORE) {
      dispatch({
        action: CheckinContextAction.SET_REVIEW_STAGE,
        payload: ReviewStage.AFTER,
      });
      router.push("/mood/moodPicker");
    } else if (state.reviewStage == ReviewStage.AFTER) {
      // in after state of activity review, show pros and cons page now
      router.push("/mood/prosCons");
    } else {
      // freestanding activity, reviewstage is null, go to review page
      router.push("/mood/activityReview");
    }
    dispatch({
      action:
        state.reviewStage == ReviewStage.BEFORE || state.reviewStage == null
          ? CheckinContextAction.SET_ENERGY_BEFORE
          : CheckinContextAction.SET_ENERGY_AFTER,
      payload: derivedPercentage.value.substring(
        0,
        derivedPercentage.value.length - 1
      ),
    });
  };

  const derivedPercentage = useDerivedValue(
    () => Math.floor(fill.value * 100) + "%"
  );

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin((e) => {
        let newFill = 1 - e.y / batteryContainerHeight;
        newFill = Math.min(Math.max(newFill, 0), 1); // clamp
        fill.value = withTiming(newFill, { duration: 300 });
        fillAbove.value = withTiming(newFill + fillLayerOffset, {
          duration: 300,
        });
        fillBelow.value = withTiming(newFill - fillLayerOffset, {
          duration: 300,
        });
      })
      .onUpdate((e) => {
        let newFill = 1 - e.y / batteryContainerHeight;
        newFill = Math.min(Math.max(newFill, 0), 1); // clamp
        fill.value = newFill; // no transition on the constantly updating value!
        fillAbove.value = newFill + fillLayerOffset; // no transition on the constantly updating value!
        fillBelow.value = newFill - fillLayerOffset; // no transition on the constantly updating value!
      })
      .onEnd((e) => {
        let newFill = 1 - e.y / batteryContainerHeight;
        newFill = Math.min(Math.max(newFill, 0), 1); // clamp
        fill.value = withTiming(newFill, { duration: 300 });
        fillAbove.value = withTiming(newFill + fillLayerOffset, {
          duration: 300,
        });
        fillBelow.value = withTiming(newFill - fillLayerOffset, {
          duration: 300,
        });
      });
  }, []);
  const onLayout = (event: LayoutChangeEvent) => {
    setBatteryContainerHeight(event.nativeEvent.layout.height);
  };

  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      ToastAndroid.show("Please complete the checkin", ToastAndroid.SHORT);
    });
    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <View
        style={{
          flex: 1,
          paddingBottom: insets.top,
        }}
      >
        <View style={styles.Container}>
          <ContextDebugView />
          <ReText
            text={derivedPercentage}
            style={[textStyles.h4, { textAlign: "center" }]}
          />
          <View id="BatteryTop" style={styles.BatteryTopStyles} />
          <GestureDetector gesture={panGesture}>
            <View id="Battery" style={styles.BatteryStyles} onLayout={onLayout}>
              <View
                id="BatteryScaleIndicator"
                style={[
                  styles.WaveContainerStyles,
                  {
                    justifyContent: "space-between",
                    zIndex: 12,
                  },
                ]}
              >
                {Array.from({ length: 10 }, (_, i) => i * 10)
                  .reverse()
                  .map((indicator) => (
                    <View
                      key={indicator}
                      style={{
                        opacity: indicator == 0 ? 0 : 1,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "rgba(0,0,0,0.3)",
                            width: 16,
                            height: 1,
                          }}
                        />
                        <Text
                          style={[
                            textStyles.bodyLarge,
                            {
                              position: "absolute",
                              left: 16 + 8,
                            },
                          ]}
                        >
                          {indicator}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
              <View
                id="Shadow"
                style={[
                  styles.WaveContainerStyles,
                  {
                    borderRadius: 16 * 3,
                    zIndex: 50,
                    boxShadow:
                      "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px, rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                  },
                ]}
              />
              <View
                style={[
                  styles.WaveContainerStyles,
                  {
                    zIndex: 0,
                  },
                ]}
              >
                <ViWave
                  baseAmplitude={15}
                  baseFrequency={1}
                  colors={batteryColors[0]}
                  fillPercent={fillAbove}
                />
              </View>
              <View
                style={[
                  styles.WaveContainerStyles,
                  {
                    zIndex: 5,
                  },
                ]}
              >
                <ViWave
                  baseAmplitude={11}
                  baseFrequency={0.8}
                  colors={batteryColors[1]}
                  fillPercent={fill}
                />
              </View>
              <View
                style={[
                  styles.WaveContainerStyles,
                  {
                    zIndex: 10,
                  },
                ]}
              >
                <ViWave
                  baseAmplitude={10}
                  baseFrequency={0.2}
                  colors={batteryColors[2]}
                  fillPercent={fillBelow}
                />
              </View>
            </View>
          </GestureDetector>
        </View>
        <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
          <ViButton
            title="Continue"
            variant="primary"
            type="light"
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: "100%",
    paddingBlock: 16 * 6,
    paddingInline: 16,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    minHeight: 90,
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
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
  BatteryStyles: {
    flex: 1,
    marginInline: 16 * 3.75,
    borderRadius: 16 * 3,
    overflow: "hidden",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  },
  BatteryTopStyles: {
    height: 32,
    marginInline: 16 * 7.5,
    borderTopRightRadius: 16 + 8,
    borderTopLeftRadius: 16 + 8,
    backgroundColor: "#797979",
  },
});
