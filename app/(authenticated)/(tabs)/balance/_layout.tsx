import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { headerStyles } from "../../../../globalStyles";

SplashScreen.preventAutoHideAsync();

export default function BalanceStackLayout() {
  return (
    <>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="perActivity" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
