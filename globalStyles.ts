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
