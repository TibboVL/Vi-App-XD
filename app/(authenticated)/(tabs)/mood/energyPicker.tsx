import { ViButton } from "@/components/ViButton";
import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
} from "@/globalStyles";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, {
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as TSVG,
} from "react-native-svg";
import { textStyles } from "../../../../globalStyles";
import { adjustLightness } from "@/constants/Colors";

export default function EnergyPickerScreen() {
  const [batteryContainerHeight, setBatteryContainerHeight] = useState(500);
  const [batteryContainerWidth, setBatteryContainerWidth] = useState(0);
  const insets = useSafeAreaInsets();

  const fillLayerOffset = 0.035;
  const fill = useSharedValue(0.15); // 0 to 1
  const fillAbove = useSharedValue(0.15 + fillLayerOffset); // 0 to 1
  const fillBelow = useSharedValue(0.15 - fillLayerOffset); // 0 to 1

  //TODO: make this update faster without cuasing pan action to lag
  const [displayedPercentage, setDisplayedPercentage] = useState("15%");

  const panGesture = Gesture.Pan()
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
      //console.log(e);
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
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBatteryContainerWidth(width);
    setBatteryContainerHeight(height);
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
            // backgroundColor: "#757575",
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
              //   rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
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
              {Array.from({ length: 10 }, (_, i) => i)
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
                      // borderColor: "blue",
                      // borderWidth: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "blue",
                        //height: 0,
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
                        {indicator * 10}
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
              <LiquidWave
                baseAmplitude={15}
                baseFrequency={1}
                speed={3000}
                opacity="55"
                //color="#f29f9c"
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
              <LiquidWave
                baseAmplitude={11}
                baseFrequency={0.8}
                speed={3000}
                opacity="99"
                //color="#ee6e68"
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
              <LiquidWave
                baseAmplitude={10}
                baseFrequency={0.2}
                speed={3000}
                //color="#ec4234"
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

// TODO: could add react-native-svg-path-gradient to make the path have a gradient color, bit nicer to look at
const AnimatedPath = Animated.createAnimatedComponent(Path);

type WaveProps = {
  baseAmplitude?: number;
  baseFrequency?: number;
  speed?: number;
  opacity?: string;
  fillPercent: SharedValue<number>;
};
export function LiquidWave({
  baseAmplitude = 20,
  baseFrequency = 2,
  speed = 3000,
  opacity = "00",
  fillPercent, // ⬅ external control
}: WaveProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const clock = useSharedValue(0);
  // const fillPercent = useSharedValue(0.75); // initial fill level: 15%

  useEffect(() => {
    clock.value = withRepeat(
      withTiming(1000 * 2 * Math.PI, {
        duration: 4000 * 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Generate multiple phase values with different offsets
  const phase1 = useDerivedValue(() => (clock.value + 0) % (2 * Math.PI));
  const phase2 = useDerivedValue(() => (clock.value + 1) % (2 * Math.PI));
  const phase3 = useDerivedValue(() => (clock.value + 2) % (2 * Math.PI));

  // Amplitude gently oscillates to simulate liquid motion
  const amplitudeOscillation = useDerivedValue(() => {
    const t = clock.value; // from 0 to 2pi in ~4 seconds
    return (
      baseAmplitude +
      5 * Math.sin(t * ((1.2 * 4) / (2 * Math.PI))) + // scale factor for timing
      3 * Math.sin(t * ((2.3 * 4) / (2 * Math.PI)) + 1)
    );
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };
  const animatedProps = useAnimatedProps(() => {
    if (containerWidth === 0 || containerHeight === 0)
      return { d: "", fill: "" };

    const amp = amplitudeOscillation.value;
    const steps = 30;

    // baseY is the vertical position (from top) based on fill level
    const baseY = containerHeight * (1 - fillPercent.value);
    let path = `M 0 ${baseY.toFixed(2)}`;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * containerWidth;
      const y =
        baseY +
        amp *
          (0.5 *
            Math.sin(
              (baseFrequency * 2 * Math.PI * x) / containerWidth + phase1.value
            ) +
            0.3 *
              Math.sin(
                (baseFrequency * 3.5 * 2 * Math.PI * x) / containerWidth +
                  phase2.value
              ) +
            0.2 *
              Math.sin(
                (baseFrequency * 1.5 * 2 * Math.PI * x) / containerWidth +
                  phase3.value
              ));

      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    path += ` L ${containerWidth} ${containerHeight}`;
    path += ` L 0 ${containerHeight} Z`;

    // color calculations
    const fillValue = interpolateColor(
      fillPercent.value,
      [0, 0.25, 0.5, 0.75, 1],
      ["#ec4235", "#ec4235", "#f5bd7a", "#d0fe83", "#5fb496"]
    );
    return { d: path, fill: fillValue };
  });

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {containerWidth > 0 && containerHeight > 0 && (
        <Svg width="100%" height="100%">
          <AnimatedPath animatedProps={animatedProps} />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    //gap: 8,
    flex: 1,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    minHeight: 90,
    //backgroundColor: "blue",
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
