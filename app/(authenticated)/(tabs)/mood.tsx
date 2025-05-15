import { ViButton } from "@/components/ViButton";
import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function MoodScreen() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <View
          style={{
            height: "100%",
            display: "flex",
            flex: 1,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: 500,
            }}
          >
            <View
              style={{
                width: "100%",
                zIndex: 10,
                left: 0,
                position: "absolute",
                bottom: -50,
              }}
            >
              <Wave amplitude={0.03} phase={0} color="#ff2c2c" />
            </View>
            <View
              style={{
                zIndex: 5,
                left: 0,
                width: "100%",

                position: "absolute",
                bottom: -25,
              }}
            >
              <Wave amplitude={0.04} phase={0.33} color="#ff6464" />
            </View>
            <View
              style={{
                left: 0,
                width: "100%",

                position: "absolute",
                bottom: 0,
              }}
            >
              <Wave amplitude={0.05} phase={0.66} color="#ff9999" />
            </View>
          </View>
        </View>
        <View style={[styles.BottomContainer]}>
          <ViButton
            title="Add another check-in"
            variant="primary"
            type="light"
            onPress={() => {
              ToastAndroid.show(
                "Implement new checkin here",
                ToastAndroid.SHORT
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Wave({
  amplitude,
  phase = 0,
  color = "#FF00FF",
}: {
  amplitude: number;
  phase?: number;
  color: string;
}) {
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        //easing: Easing.inOut(Easing.sin),
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    // Add phase offset to the animation for variety between waves
    const progress = (wave.value + phase) % 1;

    // Control points oscillate slightly around center 0.5 with given amplitude
    const c1Y = 0.5 - amplitude * Math.sin(progress * 2 * Math.PI);
    const c2Y = 0.5 + amplitude * Math.sin(progress * 2 * Math.PI);

    const d = `
      M 0 0.5
      C 0.5 ${c1Y}
        0.5 ${c2Y}
        1 0.5
      L 1 1
      L 0 1
      Z
    `;
    return { d };
  });

  return (
    <Svg
      width={"100%"}
      height={450}
      viewBox="0 0 1 1"
      style={{ overflow: "visible" }}
    >
      <AnimatedPath animatedProps={animatedProps} fill={color} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
