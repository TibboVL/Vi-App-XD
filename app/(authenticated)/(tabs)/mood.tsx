import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoodScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text>Mood screen</Text>
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
