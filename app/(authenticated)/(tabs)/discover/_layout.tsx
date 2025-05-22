import { Stack, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";
import { Funnel } from "phosphor-react-native";

SplashScreen.preventAutoHideAsync();

export default function DiscoverStackLayout() {
  const glob = useGlobalSearchParams();

  return (
    <>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="activities"
          options={{
            headerShown: true,
            headerTitle: "More activities",
          }}
        />
        <Stack.Screen
          name="[activityId]"
          // options={{ headerShown: true, headerTitle: glob.title?.toString() }}
          options={{ headerShown: true, headerTitle: "Event details" }}
        />
      </Stack>
    </>
  );
}
