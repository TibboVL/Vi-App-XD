import { IconWeight } from "./../node_modules/phosphor-react-native/src/lib/index";

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
    title: "Sports",
    color: "#4caf50",
  },
  3: {
    title: "Connection",

    color: "#ff9800",
  },
  4: {
    title: "Skills",

    color: "#9c27b0",
  },
};

export function adjustLightness(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}
