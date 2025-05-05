import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, router, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { View, StyleProp, Text } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView } from "react-native-safe-area-context";
// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useAuth0, Auth0Provider } from "react-native-auth0";
SplashScreen.preventAutoHideAsync();

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
