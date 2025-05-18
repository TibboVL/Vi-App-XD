import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Privacy",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: "Location",
        }}
      />
    </Stack>
  );
}
