import { useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
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
  speed?: number;
  colors?: WaveColors;
  fillPercent: SharedValue<number>;
};
export function ViWave({
  baseAmplitude = 20,
  baseFrequency = 2,
  speed = 3000,
  colors,
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
      [colors!.low, colors!.low, colors!.medium, colors!.high, colors!.veryHigh]
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
