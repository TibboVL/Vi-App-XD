import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { View, StyleProp } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView } from "react-native-safe-area-context";
// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { headerStyles } from "@/globalStyles";
SplashScreen.preventAutoHideAsync();

export default function PorfileStackLayout() {
  return (
    <>
      <Stack screenOptions={headerStyles}>
        <Stack.Screen
          name="index"
          options={{
            title: "Settings",
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            title: "Account",
          }}
        />
      </Stack>
    </>
  );
}
