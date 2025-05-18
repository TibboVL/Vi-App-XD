import { headerStyles } from "@/globalStyles";
import { Stack } from "expo-router";

export default function PorfileStackLayout() {
  return (
    <>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
