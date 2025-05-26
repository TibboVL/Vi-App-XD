import { Stack, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";
import { Funnel } from "phosphor-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useContext } from "react";
import { CheckinProvider } from "./checkinContext";

export default function MoodStackLayout() {
  const glob = useGlobalSearchParams();

  return (
    <CheckinProvider>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="moodPicker"
          options={{
            headerShown: true,
            headerTitle: "How do you feel?",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="energyPicker"
          options={{
            headerShown: true,
            headerTitle: "How's your energy level?",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="activityReview"
          options={{
            headerShown: true,
            headerTitle: "Let’s Reflect",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="prosCons"
          options={{
            headerShown: true,
            headerTitle: "Likes & dislikes",
            headerBackVisible: false,
          }}
        />
      </Stack>
    </CheckinProvider>
  );
}
