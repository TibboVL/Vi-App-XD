import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanningScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text>Planning screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
});
