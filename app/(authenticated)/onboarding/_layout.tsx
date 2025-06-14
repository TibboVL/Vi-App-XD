import { headerStyles } from "@/globalStyles";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={headerStyles}>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="goals"
        options={{
          title: "Your Goals",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: "Location",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="gettingThingsReady"
        options={{
          title: "GettingThingsReady",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
