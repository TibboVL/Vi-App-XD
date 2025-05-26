import { ViButton } from "@/components/ViButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoodScreen() {
  function handleStartCheckin() {
    // if (router.canDismiss()) router.dismissAll();
    router.push("/mood/moodPicker");
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.Container}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text>Mood screen</Text>
        </View>
      </View>
      <View style={styles.BottomContainer}>
        <ViButton title="Add another check-in" onPress={handleStartCheckin} />
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
    flex: 1,
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
