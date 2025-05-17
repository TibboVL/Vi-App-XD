import { Stack, useGlobalSearchParams, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function DiscoverStackLayout() {
  const glob = useGlobalSearchParams();

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="activities"
          options={{ headerShown: true, headerTitle: "More activities" }}
        />
        <Stack.Screen
          name="[activityId]"
          options={{ headerShown: true, headerTitle: glob.title?.toString() }}
        />
      </Stack>
    </>
  );
}
