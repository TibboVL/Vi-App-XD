import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Prevent the splash screen from auto-hiding before asset loading is complete.
import { Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    //SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    AnekMalayalam: require("../assets/fonts/AnekMalayalam-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      NavigationBar.setBackgroundColorAsync("#f1f5f9");
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Auth0Provider
      domain={"vi-auth.eu.auth0.com"}
      clientId={"W6Hoc4HcrkiGrTc29yM8i7mP7g6QAcsy"}
    >
      <SafeAreaProvider style={{ flex: 1 }}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen
                name="(authenticated)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="signIn" options={{ headerShown: false }} />
              {/* <Stack.Screen name="register" /> */}
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Auth0Provider>
  );
}
