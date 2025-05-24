import { Stack, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";
import { Funnel } from "phosphor-react-native";

export default function MoodStackLayout() {
  const glob = useGlobalSearchParams();

  return (
    <>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="moodPicker"
          options={{
            headerShown: true,
            headerTitle: "How do you feel?",
          }}
        />
        <Stack.Screen
          name="energyPicker"
          options={{
            headerShown: true,
            headerTitle: "How's your energy level?",
          }}
        />
      </Stack>
    </>
  );
}
