import { ViButton } from "@/components/ViButton";
import { textStyles } from "@/globalStyles";
import { Link, router, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            textStyles.h3,
            {
              textAlign: "center",
            },
          ]}
        >
          This screen doesn't exist!
        </Text>

        <View
          style={{
            padding: 16,
          }}
        >
          <ViButton
            title="Go to home screen!"
            onPress={() => router.navigate("/signIn")}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
