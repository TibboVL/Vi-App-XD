import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { BackgroundColors, headerStyles } from "../../../../globalStyles";
import { Text, View } from "react-native";
import { lightStyles, ViButton } from "@/components/ViButton";
import { adjustLightness } from "@/constants/Colors";
import { useRouteInfo } from "expo-router/build/hooks";

SplashScreen.preventAutoHideAsync();

export default function BalanceStackLayout() {
  const activeRoute = useRouteInfo();
  console.log("RouteInfo:", activeRoute);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Stack screenOptions={headerStyles}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="perActivity" options={{ headerShown: false }} />
      </Stack>

      <View
        style={{
          flexDirection: "row",
          padding: 6,
          margin: 8,
          borderRadius: 24,
          gap: 8,
          backgroundColor: adjustLightness(
            BackgroundColors.primary.backgroundColor,
            15
          ),
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <ViButton
            onPress={() => router.navigate("/balance")}
            title="Timeline"
            outerStyle={{
              borderRadius: 24,
            }}
            innerStyle={{
              backgroundColor:
                activeRoute.pathname == "/balance"
                  ? lightStyles.primary.backgroundColor
                  : "transparent",
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          <ViButton
            onPress={() =>
              router.navigate({
                pathname: "/balance/perActivity",
                params: {
                  showTabBar: 1,
                },
              })
            }
            title="Activity impact"
            outerStyle={{
              borderRadius: 24,
            }}
            innerStyle={{
              backgroundColor:
                activeRoute.pathname == "/balance/perActivity"
                  ? lightStyles.primary.backgroundColor
                  : "transparent",
            }}
          />
        </View>
      </View>
    </View>
  );
}
