import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";

SplashScreen.preventAutoHideAsync();

export default function DiscoverStackLayout() {
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
          options={{ headerShown: true, headerTitle: "Event details" }}
        />
      </Stack>
    </>
  );
}
