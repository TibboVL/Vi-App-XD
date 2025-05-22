"use strict";
import { StyleSheet } from "react-native";

export const textStyles = StyleSheet.create({
  h1: {
    fontFamily: "AnekMalayalam",
    fontWeight: "bold",
    fontSize: 44,
  },
  h2: {
    fontFamily: "AnekMalayalam",
    fontWeight: "semibold",

    fontSize: 32,
  },
  h3: {
    fontFamily: "AnekMalayalam",
    fontWeight: "medium",

    fontSize: 24,
  },
  h4: {
    fontFamily: "AnekMalayalam",
    fontWeight: "medium",

    fontSize: 20,
  },
  bodyLarge: {
    fontFamily: "AnekMalayalam",
    fontWeight: "regular",

    fontSize: 16,
  },
  CTA: {
    fontFamily: "AnekMalayalam",
    fontWeight: "bold",

    fontSize: 16,
  },
  bodySmall: {
    fontFamily: "AnekMalayalam",
    fontWeight: "regular",

    fontSize: 12,
  },
});

export const TextColors = {
  primary: {
    color: "#2a2a2a",
  },
  muted: {
    color: "#626262",
  },
};

export const BackgroundColors = {
  background: "#f2f2f2",
  primary: { backgroundColor: "#98cdac" },
  secondary: { backgroundColor: "#7eace7" },
  danger: { backgroundColor: "#ffa2a2" },
};

export const headerStyles = {
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: "#f2f2f2",
  },
  headerTitleStyle: textStyles.h3,
};

export const safeAreaStyles = {
  flex: 1,
  paddingTop: 0,
};
export const safeAreaEdges = ["left", "right", "bottom"] as const;
