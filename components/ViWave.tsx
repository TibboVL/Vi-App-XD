import { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

// TODO: could add react-native-svg-path-gradient to make the path have a gradient color, bit nicer to look at
const AnimatedPath = Animated.createAnimatedComponent(Path);
type WaveColors = {
  low: string;
  medium: string;
  high: string;
  veryHigh: string;
};
type WaveProps = {
  baseAmplitude?: number;
  baseFrequency?: number;
  colors?: WaveColors;
  fillPercent: SharedValue<number>;
};

const STEPS = 25;
const COLOR_INPUT = [0, 0.25, 0.5, 0.75, 1];

export function ViWave({
  baseAmplitude = 20,
  baseFrequency = 2,
  colors,
  fillPercent, // ⬅ external control
}: WaveProps) {
  const widthSV = useSharedValue(0);
  const heightSV = useSharedValue(0);

  const clock = useSharedValue(0);

  useEffect(() => {
    if (widthSV.value && heightSV.value) {
      clock.value = withRepeat(
        withTiming(1000 * 2 * Math.PI, {
          duration: 4000 * 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
    return () => {
      cancelAnimation(clock);
      clock.value = 0;
    };
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

  const onLayout = (e: LayoutChangeEvent) => {
    widthSV.value = e.nativeEvent.layout.width;
    heightSV.value = e.nativeEvent.layout.height;
  };

  const twoPi = 2 * Math.PI;
  const freqRatio1 = (baseFrequency * twoPi) / widthSV.value;
  const freqRatio2 = (baseFrequency * 3.5 * twoPi) / widthSV.value;
  const freqRatio3 = (baseFrequency * 1.5 * twoPi) / widthSV.value;

  const animatedProps = useAnimatedProps(() => {
    if (widthSV.value === 0 || heightSV.value === 0) return { d: "", fill: "" };

    const amp = amplitudeOscillation.value;

    // baseY is the vertical position (from top) based on fill level
    const baseY = heightSV.value * (1 - fillPercent.value);
    const cmds = [`M 0 ${baseY.toFixed(2)}`];

    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * widthSV.value;
      const y =
        baseY +
        amp *
          (0.5 * Math.sin(freqRatio1 * x + phase1.value) +
            0.3 * Math.sin(freqRatio2 * x + phase2.value) +
            0.2 * Math.sin(freqRatio3 * x + phase3.value));
      cmds.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    cmds.push(
      `L ${widthSV.value} ${heightSV.value}`,
      `L 0 ${heightSV.value}`,
      `Z`
    );

    // color calculations
    const fillValue = interpolateColor(fillPercent.value, COLOR_INPUT, [
      colors!.low,
      colors!.low,
      colors!.medium,
      colors!.high,
      colors!.veryHigh,
    ]);
    return { d: cmds.join(" "), fill: fillValue };
  });

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {widthSV.value > 0 && heightSV.value > 0 && (
        <Svg width="100%" height="100%">
          <AnimatedPath animatedProps={animatedProps} />
        </Svg>
      )}
    </View>
  );
}
