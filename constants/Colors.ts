import { IconWeight } from "./../node_modules/phosphor-react-native/src/lib/index";
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#62626a";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#f1f5f9",
    tint: tintColorLight,
    icon: "#687076",
    weight: "fill" as IconWeight,
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
};

export const pillarColors: Record<number, { title: string; color: string }> = {
  1: {
    title: "Mindfulness",
    color: "#76bee7",
  },
  2: {
    title: "Physical Activity",
    color: "#4caf50",
  },
  3: {
    title: "Skillset Optimization",
    color: "#ff9800",
  },
  4: {
    title: "Social Connection",
    color: "#9c27b0",
  },
};
