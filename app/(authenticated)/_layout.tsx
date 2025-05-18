import { Stack, Redirect } from "expo-router";
import { View, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function RootLayout() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <View>
        <Text>Loading placeholder</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/signIn"} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable the default header for all screens within this stack
      }}
    ></Stack>
  );
}
