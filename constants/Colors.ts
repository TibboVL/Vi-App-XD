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
export const pillarColors = {
  mindfulness: {
    title: "Mindfulness",
    color: "#5bc0eb",
  },
  sports: {
    title: "Sports",
    color: "#58d68d",
  },
  connections: {
    title: "Connection",
    color: "#ffa552",
  },
  skills: {
    title: "Skills",
    color: "#a66dd4",
  },
};

export type PillarKey = keyof typeof pillarColors;

function hexToHSL(hex: string) {
  // Remove "#" if present
  hex = hex.replace(/^#/, "");

  // Convert short hex to full hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color =
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

export function adjustLightness(hex: string, delta: number) {
  const hsl = hexToHSL(hex);
  const newL = Math.min(100, Math.max(0, hsl.l + delta));
  return hslToHex(hsl.h, hsl.s, newL);
}
