import { getPillarInfo, PillarKey } from "@/types/activity";
import { adjustLightness } from "@/constants/Colors";
import React from "react";
import { Text, View, StyleSheet } from "react-native";

const globStyles = require("../globalStyles");

export interface TagProps {
  label: string;
  pillar: PillarKey;
}

export function Tag({ label, pillar }: TagProps) {
  const color = getPillarInfo(pillar)?.color;

  return color ? (
    <View style={[styles.tag, { backgroundColor: adjustLightness(color, 20) }]}>
      <Text
        style={[globStyles.bodySmall, { color: adjustLightness(color, -30) }]}
      >
        {label}
      </Text>
    </View>
  ) : (
    <Text>Color not found</Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
});
