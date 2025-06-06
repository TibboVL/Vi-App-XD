import { Stack, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";
import { Funnel } from "phosphor-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useContext } from "react";
import {
  CheckinProvider,
  ReviewStage,
  useCheckinState,
} from "./checkinContext";

export default function MoodStackLayout() {
  const glob = useGlobalSearchParams();
  const state = useCheckinState();

  return (
    <Stack screenOptions={headerStyles}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, freezeOnBlur: true }}
      />
      <Stack.Screen
        name="moodPicker"
        options={{
          headerShown: true,
          headerTitle:
            state.reviewStage == null
              ? "How do you feel?"
              : state.reviewStage == ReviewStage.BEFORE
              ? "How did you feel before?"
              : "How did you feel afterwards?",

          headerBackVisible: false,
          freezeOnBlur: true,
        }}
      />
      <Stack.Screen
        name="energyPicker"
        options={{
          headerShown: true,
          headerTitle:
            state.reviewStage == null
              ? "How's your energy level?"
              : state.reviewStage == ReviewStage.BEFORE
              ? "How was your energy before?"
              : "How was your energy afterwards?",
          headerBackVisible: false,
          freezeOnBlur: true,
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
  );
}
