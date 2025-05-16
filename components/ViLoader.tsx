import { Text, View, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ViLoaderProps {
  vitoMessage: string;
  style?: ViewStyle;
}

export function Viloader({
  vitoMessage = "Vito is working on it!",
  style,
}: ViLoaderProps) {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingBlock: 16,
      }}
    >
      <VitoLoader />
      <Text>{vitoMessage}</Text>
    </View>
  );
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const VitoLoader = () => {
  // eyes bits
  const cx1 = useSharedValue(137);
  const cy1 = useSharedValue(87);
  const r1 = useSharedValue(22);

  const cx2 = useSharedValue(78);
  const cy2 = useSharedValue(87);
  const r2 = useSharedValue(22);

  const cx3 = useSharedValue(132.5);
  const cy3 = useSharedValue(82.5);
  const r3 = useSharedValue(11.5);

  const cx4 = useSharedValue(72.5);
  const cy4 = useSharedValue(82.5);
  const r4 = useSharedValue(11.5);

  const animatedCircle1Props = useAnimatedProps(() => ({
    cx: cx1.value,
    cy: cy1.value,
    r: r1.value,
  }));

  const animatedCircle2Props = useAnimatedProps(() => ({
    cx: cx2.value,
    cy: cy2.value,
    r: r2.value,
  }));

  const animatedCircle3Props = useAnimatedProps(() => ({
    cx: cx3.value,
    cy: cy3.value,
    r: r3.value,
  }));

  const animatedCircle4Props = useAnimatedProps(() => ({
    cx: cx4.value,
    cy: cy4.value,
    r: r4.value,
  }));

  // mouth bits
  const start = {
    x0: 94,
    y0: 122.87,
    cp1x: 101,
    cp1y: 128,
    cp2x: 116,
    cp2y: 128,
    x1: 122,
    y1: 122.87,
  };

  const end = {
    x0: 99,
    y0: 123.87,
    cp1x: 106,
    cp1y: 129,
    cp2x: 121,
    cp2y: 129,
    x1: 127,
    y1: 123.87,
  };

  const x0 = useSharedValue(start.x0);
  const y0 = useSharedValue(start.y0);
  const cp1x = useSharedValue(start.cp1x);
  const cp1y = useSharedValue(start.cp1y);
  const cp2x = useSharedValue(start.cp2x);
  const cp2y = useSharedValue(start.cp2y);
  const x1 = useSharedValue(start.x1);
  const y1 = useSharedValue(start.y1);

  const animatedMouthProps = useAnimatedProps(() => ({
    d: `M${x0.value} ${y0.value} C${cp1x.value} ${cp1y.value} ${cp2x.value} ${cp2y.value} ${x1.value} ${y1.value}`,
  }));

  useEffect(() => {
    const duration = 1000;
    const easing = Easing.inOut(Easing.ease);

    // Animate back and forth forever
    cx1.value = withRepeat(
      withSequence(
        withTiming(142, { duration, easing }),
        withTiming(137, { duration, easing })
      ),
      -1,
      true
    );
    cy1.value = withRepeat(
      withSequence(
        withTiming(88, { duration, easing }),
        withTiming(87, { duration, easing })
      ),
      -1,
      true
    );
    r1.value = withRepeat(
      withSequence(
        withTiming(22, { duration, easing }),
        withTiming(22, { duration, easing })
      ),
      -1,
      true
    );

    cx2.value = withRepeat(
      withSequence(
        withTiming(83, { duration, easing }),
        withTiming(78, { duration, easing })
      ),
      -1,
      true
    );
    cy2.value = withRepeat(
      withSequence(
        withTiming(88, { duration, easing }),
        withTiming(87, { duration, easing })
      ),
      -1,
      true
    );
    r2.value = withRepeat(
      withSequence(
        withTiming(22, { duration, easing }),
        withTiming(22, { duration, easing })
      ),
      -1,
      true
    );

    cx3.value = withRepeat(
      withSequence(
        withTiming(148.5, { duration, easing }),
        withTiming(132.5, { duration, easing })
      ),
      -1,
      true
    );
    cy3.value = withRepeat(
      withSequence(
        withTiming(84.5, { duration, easing }),
        withTiming(82.5, { duration, easing })
      ),
      -1,
      true
    );
    r3.value = withRepeat(
      withSequence(
        withTiming(11.5, { duration, easing }),
        withTiming(11.5, { duration, easing })
      ),
      -1,
      true
    );

    cx4.value = withRepeat(
      withSequence(
        withTiming(88.5, { duration, easing }),
        withTiming(72.5, { duration, easing })
      ),
      -1,
      true
    );
    cy4.value = withRepeat(
      withSequence(
        withTiming(84.5, { duration, easing }),
        withTiming(82.5, { duration, easing })
      ),
      -1,
      true
    );
    r4.value = withRepeat(
      withSequence(
        withTiming(11.5, { duration, easing }),
        withTiming(11.5, { duration, easing })
      ),
      -1,
      true
    );

    // mouth bits

    const animate = (sharedValue: any, from: any, to: any) =>
      withRepeat(
        withSequence(
          withTiming(to, { duration, easing }),
          withTiming(from, { duration, easing })
        ),
        -1,
        true
      );

    animate(x0, start.x0, end.x0);
    animate(y0, start.y0, end.y0);
    animate(cp1x, start.cp1x, end.cp1x);
    animate(cp1y, start.cp1y, end.cp1y);
    animate(cp2x, start.cp2x, end.cp2x);
    animate(cp2y, start.cp2y, end.cp2y);
    animate(x1, start.x1, end.x1);
    animate(y1, start.y1, end.y1);
  }, []);

  return (
    <Svg width={225} height={202} viewBox="0 0 225 202" fill="none">
      <Path
        d="M221.673 96.9126C244.739 16.3795 143.592 -32.2551 50.6105 24.819C-42.2273 81.8931 10.0657 186.457 69.0921 199.474C127.975 212.491 199.466 174.728 221.673 96.9126Z"
        fill="#4DA06D"
      />
      <AnimatedCircle animatedProps={animatedCircle1Props} fill="white" />
      <AnimatedCircle animatedProps={animatedCircle2Props} fill="white" />
      <AnimatedCircle animatedProps={animatedCircle3Props} fill="#626262" />
      <AnimatedCircle animatedProps={animatedCircle4Props} fill="#626262" />

      <AnimatedPath
        stroke="white"
        strokeWidth={5}
        strokeLinecap="round"
        animatedProps={animatedMouthProps}
      />
    </Svg>
  );
};
