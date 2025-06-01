import { useFocusEffect } from "expo-router";
import {
  ForwardedRef,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
type TransformProps = {
  translateX?: number;
  translateY?: number;
  scale?: number;
  rotate?: string;
  opacity?: number;
};

type PathProps = {
  d?: string; // only for `Path` components like mouth
};
type PartProps = TransformProps & PathProps;

type VitoPartsConfig = {
  Body?: PartProps;
  Mouth?: PartProps;
  CircleMouth?: PartProps;
  LeftEye?: PartProps;
  RightEye?: PartProps;
  LeftPupil?: PartProps;
  RightPupil?: PartProps;
  LeftEyeReflection?: PartProps;
  RightEyeReflection?: PartProps;
  LeftEyeExtraReflection?: PartProps;
  RightEyeExtraReflection?: PartProps;
  LeftEyeLid?: PartProps;
  RightEyeLid?: PartProps;
  LeftCheek?: PartProps;
  RightCheek?: PartProps;
  LeftAngryEyeLid?: PartProps;
  RightAngryEyeLid?: PartProps;
};

export type VitoEmoteConfig = Record<
  "happy" | "sad" | "angry" | "fearful" | "surprised" | "bad",
  VitoPartsConfig
>;

const vitoEmoteConfig: VitoEmoteConfig = {
  happy: {
    Mouth: {
      d: "M98 128C105 134 120 134 126 128",
      opacity: 1,
    },
    CircleMouth: {
      scale: 0, // hidden
      opacity: 0,
    },
    LeftEye: { translateY: 0 },
    RightEye: { translateY: 0 },
    LeftPupil: { translateY: 0, scale: 0.65 },
    RightPupil: { translateY: 0, scale: 0.65 },
    LeftEyeReflection: { opacity: 0 },
    RightEyeReflection: { opacity: 0 },
    LeftEyeExtraReflection: { opacity: 0, translateX: 0, scale: 0 },
    RightEyeExtraReflection: { opacity: 0, translateX: 0, scale: 0 },
    LeftEyeLid: { scale: 1, translateY: 0 },
    RightEyeLid: { scale: 1, translateY: 0 },
    LeftCheek: { translateY: -35 },
    RightCheek: { translateY: -35 },
    LeftAngryEyeLid: { scale: 1, translateY: -20 },
    RightAngryEyeLid: { scale: 1, translateY: -20 },
  },
  sad: {
    Mouth: {
      d: "M98 128C105 122.667 120 122.667 126 128",
      opacity: 1,
    },
    CircleMouth: {
      scale: 0,
      opacity: 0,
    },
    LeftEye: { translateY: 5 },
    RightEye: { translateY: 5 },
    LeftPupil: { translateY: 25, scale: 0.45 },
    RightPupil: { translateY: 25, scale: 0.45 },
    LeftEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    RightEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    LeftEyeExtraReflection: { opacity: 0, scale: 0 },
    RightEyeExtraReflection: { opacity: 0, scale: 0 },
    LeftEyeLid: { scale: 1, translateY: 20 },
    RightEyeLid: { scale: 1, translateY: 20 },
    LeftCheek: { translateY: 0 },
    RightCheek: { translateY: 0 },
    LeftAngryEyeLid: { scale: 1, translateY: -20 },
    RightAngryEyeLid: { scale: 1, translateY: -20 },
  },
  bad: {
    Mouth: {
      d: "M98 128C105 122.667 120 122.667 126 128",
      opacity: 1,
    },
    CircleMouth: {
      scale: 0,
      opacity: 0,
    },
    LeftEye: { translateY: 5 },
    RightEye: { translateY: 5 },
    LeftPupil: { translateY: 55, scale: 0.3 },
    RightPupil: { translateY: 55, scale: 0.3 },
    LeftEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    RightEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    LeftEyeExtraReflection: { opacity: 0, scale: 0 },
    RightEyeExtraReflection: { opacity: 0, scale: 0 },
    LeftEyeLid: { scale: 1.6, translateY: 18 },
    RightEyeLid: { scale: 1.6, translateY: 18 },
    LeftCheek: { translateY: 0 },
    RightCheek: { translateY: 0 },
    LeftAngryEyeLid: { scale: 1, translateY: -20 },
    RightAngryEyeLid: { scale: 1, translateY: -20 },
  },
  fearful: {
    Mouth: {
      d: "M98 128C105 122.667 120 122.667 126 128",
      opacity: 0,
      scale: 0,
    },
    CircleMouth: {
      scale: 1,
      opacity: 1,
    },
    LeftEye: { translateY: 0 },
    RightEye: { translateY: 0 },
    LeftPupil: { translateY: 0, scale: 1 },
    RightPupil: { translateY: 0, scale: 1 },
    LeftEyeReflection: { opacity: 1, translateX: 0, scale: 1 },
    RightEyeReflection: { opacity: 1, translateX: 0, scale: 1 },
    LeftEyeExtraReflection: { opacity: 1, scale: 1 },
    RightEyeExtraReflection: { opacity: 1, scale: 1 },
    LeftEyeLid: { scale: 1, translateY: 0 },
    RightEyeLid: { scale: 1, translateY: 0 },
    LeftCheek: { translateY: 0 },
    RightCheek: { translateY: 0 },
    LeftAngryEyeLid: { scale: 1, translateY: -20 },
    RightAngryEyeLid: { scale: 1, translateY: -20 },
  },
  surprised: {
    Mouth: {
      d: "M98 128C105 122.667 120 122.667 126 128",
      opacity: 0,
      scale: 0,
    },
    CircleMouth: {
      scale: 1,
      opacity: 1,
    },
    LeftEye: { translateY: 0 },
    RightEye: { translateY: 0 },
    LeftPupil: { translateY: 0, scale: 1 },
    RightPupil: { translateY: 0, scale: 1 },
    LeftEyeReflection: { opacity: 1, translateX: 20, scale: 0.6 },
    RightEyeReflection: { opacity: 1, translateX: 20, scale: 0.6 },
    LeftEyeExtraReflection: { opacity: 0, scale: 0 },
    RightEyeExtraReflection: { opacity: 0, scale: 0 },
    LeftEyeLid: { scale: 1, translateY: 0 },
    RightEyeLid: { scale: 1, translateY: 0 },
    LeftCheek: { translateY: 0 },
    RightCheek: { translateY: 0 },
    LeftAngryEyeLid: { scale: 1, translateY: -20 },
    RightAngryEyeLid: { scale: 1, translateY: -20 },
  },
  angry: {
    Mouth: {
      d: "M98 128C105 122.667 120 122.667 126 128",
      opacity: 1,
    },
    CircleMouth: {
      scale: 0,
      opacity: 0,
    },
    LeftEye: { translateY: 5 },
    RightEye: { translateY: 5 },
    LeftPupil: { translateY: 15, scale: 0.6 },
    RightPupil: { translateY: 15, scale: 0.6 },
    LeftEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    RightEyeReflection: { opacity: 0, translateX: 0, scale: 0 },
    LeftEyeExtraReflection: { opacity: 0, scale: 0 },
    RightEyeExtraReflection: { opacity: 0, scale: 0 },
    LeftEyeLid: { scale: 1, translateY: 0 },
    RightEyeLid: { scale: 1, translateY: 0 },
    LeftCheek: { translateY: 0 },
    RightCheek: { translateY: 0 },
    LeftAngryEyeLid: { scale: 1, translateY: 0, rotate: "30" },
    RightAngryEyeLid: { scale: 1, translateY: 0 },
  },
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

function useAnimatedTransform(
  partKey: keyof VitoPartsConfig,
  targetMood: keyof VitoEmoteConfig
) {
  const shared = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    scale: useSharedValue(1),
    opacity: useSharedValue(1),
    rotate: useSharedValue("0deg"),
    d: useSharedValue(""), // for Path only
  };

  useEffect(() => {
    const config = vitoEmoteConfig[targetMood][partKey];
    if (!config) return;

    if (config.translateX !== undefined)
      shared.translateX.value = withTiming(config.translateX);
    if (config.translateY !== undefined)
      shared.translateY.value = withTiming(config.translateY);
    if (config.scale !== undefined)
      shared.scale.value = withTiming(config.scale);
    if (config.opacity !== undefined)
      shared.opacity.value = withTiming(config.opacity);
    if (config.rotate !== undefined) shared.rotate.value = config.rotate; // static for now
    if (config.d !== undefined) shared.d.value = config.d; // you could animate with morphing lib

    return () => {
      cancelAnimation(shared.translateX);
      cancelAnimation(shared.translateY);
      cancelAnimation(shared.scale);
      cancelAnimation(shared.opacity);
      cancelAnimation(shared.d);
    };
  }, [targetMood]);

  return shared;
}

export type VitoAnimatedMoodHandles = {
  setMood: (mood: keyof VitoEmoteConfig) => void;
};

export const VitoAnimatedMoods = forwardRef(
  (props: {}, ref: ForwardedRef<VitoAnimatedMoodHandles>) => {
    const [mood, setMood] = useState("happy" as keyof VitoEmoteConfig);

    useImperativeHandle(ref, () => ({
      setMood(mood: keyof VitoEmoteConfig) {
        setMood(mood);
      },
    }));

    const mouth = useAnimatedTransform("Mouth", mood);
    const circleMouth = useAnimatedTransform("CircleMouth", mood);
    const leftEye = useAnimatedTransform("LeftEye", mood);
    const rightEye = useAnimatedTransform("RightEye", mood);
    const leftPupil = useAnimatedTransform("LeftPupil", mood);
    const rightPupil = useAnimatedTransform("RightPupil", mood);
    const leftEyeReflection = useAnimatedTransform("LeftEyeReflection", mood);
    const rightEyeReflection = useAnimatedTransform("RightEyeReflection", mood);
    const leftEyeExtraReflection = useAnimatedTransform(
      "LeftEyeExtraReflection",
      mood
    );
    const rightEyeExtraReflection = useAnimatedTransform(
      "RightEyeExtraReflection",
      mood
    );
    const leftEyeLid = useAnimatedTransform("LeftEyeLid", mood);
    const rightEyeLid = useAnimatedTransform("RightEyeLid", mood);
    const leftCheek = useAnimatedTransform("LeftCheek", mood);
    const rightCheek = useAnimatedTransform("RightCheek", mood);
    const leftAngryEyeLid = useAnimatedTransform("LeftAngryEyeLid", mood);
    const rightAngryEyelid = useAnimatedTransform("RightAngryEyeLid", mood);

    const animatedProps = (
      shared: ReturnType<typeof useAnimatedTransform>,
      centerX: number,
      centerY: number,
      isPath = false
    ) =>
      useAnimatedProps(() =>
        !isPath
          ? {
              opacity: shared.opacity.value,
              transform: [
                { translateX: centerX },
                { translateY: centerY },
                { scale: shared.scale.value },
                { translateX: -centerX },
                { translateY: -centerY },
                { translateX: shared.translateX.value },
                { translateY: shared.translateY.value },
              ],
            }
          : {
              opacity: shared.opacity.value,
              transform: [
                { translateX: shared.translateX.value },
                { translateY: shared.translateY.value },
                { scale: shared.scale.value },
              ],
            }
      );

    const animatedMouthProps = useAnimatedProps(() => ({
      d: mouth.d.value,
      opacity: mouth.opacity.value,
    }));

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    // use focus effect so this heavy component unmounts once the route changes
    /*   useFocusEffect(() => {
    const allMoods = Object.keys(vitoEmoteConfig).map((key) => key) as [
      keyof VitoEmoteConfig
    ];

    // ! temporary just to test all possible emotes
    intervalRef.current = setInterval(() => {
      const currentIndex = allMoods.findIndex((m) => m == mood);
      const len = allMoods.length;
      setMood(() =>
        currentIndex + 1 >= len ? allMoods[0] : allMoods[currentIndex + 1]
      );
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }); */

    const debugStrokeColor = "transparent";

    return (
      <>
        {/* <Text>{mood}</Text> */}
        <Svg width={225} height={202} viewBox="0 0 225 202" fill="none">
          <AnimatedPath
            id="Body"
            d="M221.673 96.9126C244.739 16.3795 143.592 -32.2551 50.6105 24.819C-42.2273 81.8931 10.0657 186.457 69.0921 199.474C127.975 212.491 199.466 174.728 221.673 96.9126Z"
            fill="#4DA06D"
          />
          <AnimatedEllipse
            id="CircleMouth"
            cx={112.5}
            cy={123.5}
            rx={10.5}
            ry={12.5}
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(circleMouth, 112.5, 123.5)}
          />
          <AnimatedCircle
            id="RightEye"
            cx={142}
            cy={87}
            r={22}
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightEye, 142, 87)}
          />
          <AnimatedCircle
            id="LeftEye"
            cx={83}
            cy={87}
            r={22}
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftEye, 83, 87)}
          />
          <AnimatedCircle
            id="RightPupil"
            cx={141.5}
            cy={87.5}
            r={17.5}
            fill="#626262"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightPupil, 141.5, 87.5)}
          />
          <AnimatedCircle
            id="LeftPupil"
            cx={83.5}
            cy={87.5}
            r={17.5}
            fill="#626262"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftPupil, 83.5, 87.5)}
          />
          <AnimatedEllipse
            id="RightEyeReflection"
            cx={135.752}
            cy={80}
            rx={12.7102}
            ry={9.8251}
            transform="rotate(-31.3165 135.752 80)"
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightEyeReflection, 135.752, 80)}
          />
          <AnimatedEllipse
            id="LeftEyeReflection"
            cx={77.9652}
            cy={80}
            rx={12.7102}
            ry={9.8251}
            transform="rotate(-31.3165 77.9652 80)"
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftEyeReflection, 77.9652, 80)}
          />
          <AnimatedEllipse
            id="LeftEyeExtraReflection"
            cx={90}
            cy={90}
            rx={4}
            ry={3}
            transform="rotate(-34.9987 90 90)"
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftEyeExtraReflection, 90, 90)}
          />
          <AnimatedEllipse
            id="RightEyeExtraReflection"
            cx={146.997}
            cy={90}
            rx={4}
            ry={3}
            transform="rotate(-34.9987 146.997 90)"
            fill="white"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightEyeExtraReflection, 146.997, 90)}
          />
          <AnimatedPath
            id="RightEyeLid"
            d="M167.997 64.8167C167.06 64.4668 135.401 64.9184 125.373 48.897L151.93 40.6689C157.598 48.8348 168.747 65.0966 167.997 64.8167Z"
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightEyeLid, 147.06, 52.88)}
          />
          <AnimatedPath
            id="LeftEyeLid"
            d="M100.155 52.0921C99.1971 52.378 74.2179 71.8341 56.5556 65.1041L72.7752 42.5226C82.2213 45.6171 100.922 51.8633 100.155 52.0921Z"
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftEyeLid, 78.74, 57.18)}
          />
          <AnimatedEllipse
            id="LeftCheek"
            cx={81.5}
            cy={146.5}
            rx={20.5}
            ry={15.5}
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftCheek, 81.5, 156.5)}
          />
          <AnimatedEllipse
            id="RightCheek"
            cx={141.5}
            cy={147.5}
            rx={20.5}
            ry={15.5}
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightCheek, 141.5, 147.5)}
          />

          <AnimatedRect
            id="leftAngryEyelid"
            x={80}
            y={18}
            width={48}
            height={38}
            rotation={16}
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(leftAngryEyeLid, 60, 30)}
          />
          <AnimatedRect
            id="rightAngryEyelid"
            x={90}
            y={80}
            width={48}
            height={38}
            rotation={-16}
            fill="#4DA06D"
            stroke={debugStrokeColor}
            animatedProps={animatedProps(rightAngryEyelid, 120, 30)}
          />

          {/* mouth last so its rendered on top*/}
          <AnimatedPath
            id="Mouth"
            d="M98 128C105 122.667 120 122.667 126 128"
            stroke="white"
            strokeWidth={5}
            strokeLinecap="round"
            animatedProps={animatedMouthProps}
          />
        </Svg>
        {/* <Text>Work in progress</Text> */}
      </>
    );
  }
);
