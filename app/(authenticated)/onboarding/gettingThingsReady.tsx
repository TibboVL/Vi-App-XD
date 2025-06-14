import { Viloader } from "@/components/ViLoader";
import { textStyles } from "@/globalStyles";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GettingThingsReady() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(tabs)/");
    }, 1200);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          maxHeight: 280,
        }}
      >
        <Viloader
          message="Getting everything ready for you!"
          messageStyling={[
            textStyles.h3,
            {
              paddingTop: 20,
            },
          ]}
        />
      </View>
      <Text style={styles.subtext}>
        We’re personalizing your experience based on your goals.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  subtext: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280", // Tailwind gray-500
    textAlign: "center",
  },
});
