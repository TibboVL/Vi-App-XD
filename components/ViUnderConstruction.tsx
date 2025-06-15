import { View, Text } from "react-native";

export default function UnderConstruction({
  inPopup = false,
}: {
  inPopup?: boolean;
}) {
  return (
    <View
      style={{
        minHeight: 300,
        height: inPopup ? "auto" : "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        paddingVertical: inPopup ? 12 : 24,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
          color: "#444",
        }}
      >
        🚧 This area is under construction!
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          color: "#666",
          maxWidth: 300,
        }}
      >
        We’re still building this part. Check back soon to see it in action!
      </Text>
    </View>
  );
}
