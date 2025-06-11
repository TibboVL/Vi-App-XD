import { headerStyles } from "@/globalStyles";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={headerStyles}>
      <Stack.Screen
        name="index"
        options={{
          title: "Privacy",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy",
        }}
      />
      <Stack.Screen
        name="goals"
        options={{
          title: "Your Goals",
        }}
      />
    </Stack>
  );
}
