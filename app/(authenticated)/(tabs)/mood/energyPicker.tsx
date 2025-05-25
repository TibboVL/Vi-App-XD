import { ViButton } from "@/components/ViButton";
import { useMemo, useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { textStyles } from "../../../../globalStyles";
import { ViWave } from "@/components/ViWave";

export default function EnergyPickerScreen() {
  const [batteryContainerHeight, setBatteryContainerHeight] = useState(500);
  const insets = useSafeAreaInsets();

  const fillLayerOffset = 0.035;
  const fill = useSharedValue(0.15); // 0 to 1
  const fillAbove = useSharedValue(0.15 + fillLayerOffset); // 0 to 1
  const fillBelow = useSharedValue(0.15 - fillLayerOffset); // 0 to 1

  //TODO: make this update faster without cuasing pan action to lag
  const [displayedPercentage, setDisplayedPercentage] = useState("15%");

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
        runOnJS(setDisplayedPercentage)(Math.floor(newFill * 100) + "%");
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
        runOnJS(setDisplayedPercentage)(Math.floor(newFill * 100) + "%");
      });
  }, []);
  const onLayout = (event: LayoutChangeEvent) => {
    setBatteryContainerHeight(event.nativeEvent.layout.height);
  };
  return (
    <View
      style={[
        styles.Container,
        {
          paddingBottom: insets.top, // weirdly enough i have to apply this to the bottom or the height will be too tall??
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          paddingBlock: 16 * 6,
        }}
      >
        <Text style={[textStyles.h4, { textAlign: "center" }]}>
          {displayedPercentage}
        </Text>

        <View
          id="BatteryTop"
          style={{
            height: 32,
            marginInline: 16 * 7.5,
            borderTopRightRadius: 16 + 8,
            borderTopLeftRadius: 16 + 8,
            boxShadow:
              "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px, rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,   ",
          }}
        >
          <Defs>
            <LinearGradient x1="0%" y1="0%" x2="50%" y2="0%">
              <Stop offset="0" stopColor="#DDDDDD" stopOpacity="0" />
              <Stop offset="1" stopColor="#666666" stopOpacity="1" />
            </LinearGradient>
          </Defs>
        </View>
        <GestureDetector gesture={panGesture}>
          <View
            id="Battery"
            style={{
              flex: 1,
              marginInline: 16 * 3.75,
              borderRadius: 16 * 3,
              overflow: "hidden",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
            onLayout={onLayout}
          >
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
                      height: 0,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "blue",
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
                speed={3000}
                colors={{
                  low: "#FFA3A3",
                  medium: "#f7cf9d",
                  high: "#D4FF8F",
                  veryHigh: "#A3FFE5",
                }}
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
                speed={3000}
                colors={{
                  low: "#FF7070",
                  medium: "#FFBA70",
                  high: "#C8FF70",
                  veryHigh: "#70FFD7",
                }}
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
                speed={3000}
                colors={{
                  low: "#FF1F1F",
                  medium: "#FFA340",
                  high: "#A7DF4E",
                  veryHigh: "#2FA785",
                }}
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
          /*  onPress={() => {
            router.push({
              pathname: "/mood/energyPicker",
              });
              }} */
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
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
});
