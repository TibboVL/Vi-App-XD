import { ViButton } from "@/components/ViButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EnergyPickerScreen() {
  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <View style={styles.Container}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text>Energy screen</Text>
        </View>
      </View>
      <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
        <ViButton
          title="Continue"
          variant="primary"
          type="light"
          /*  onPress={() => {
            router.push({
              pathname: "/mood/energyPicker",
            });
          }} */
        />
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
