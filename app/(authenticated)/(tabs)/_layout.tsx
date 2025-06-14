import { Tabs, useNavigation } from "expo-router";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Calendar, Compass, Scales, Smiley, User } from "phosphor-react-native";
import { useGlobalSearchParams, useRouteInfo } from "expo-router/build/hooks";

export default function TabLayout() {
  const routeInfo = useRouteInfo();
  const glob = useGlobalSearchParams();
  const showTabBar = useMemo(() => {
    if (glob.showTabBar === "false") return false;
    if (glob.showTabBar === "true") return true;
    return routeInfo.segments.length <= 3;
  }, [JSON.stringify(glob), JSON.stringify(routeInfo.segments)]);

  const DiscoverIcon = useRenderIcon(Compass);
  const PlanningIcon = useRenderIcon(Calendar);
  const MoodIcon = useRenderIcon(Smiley);
  const BalanceIcon = useRenderIcon(Scales);
  const ProfileIcon = useRenderIcon(User);
  const navigation = useNavigation();

  const routeStack = navigation.getState()?.routes.length;
  if (routeStack != undefined && routeStack > 1) {
    console.warn(
      `❌  More than 1 route stack is detected (currently: ${routeStack} routes stacked)! please look into this because it can cause a ton of lag if this piles up and causes weird unexpected behavior!`
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarItemStyle: {
          marginBlock: 12,
        },
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute" as const,
            height: 80,
            backgroundColor: "#f1f5f9",
            display: showTabBar ? "flex" : "none",
          },
          android: {
            height: 80,
            backgroundColor: "#f1f5f9",
            paddingInline: 12,
            display: showTabBar ? "flex" : "none",
          },
        }),
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} redirect />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: DiscoverIcon,
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: "Planning",
          tabBarIcon: PlanningIcon,
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: "Mood",
          tabBarIcon: MoodIcon,
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: "Balance",
          tabBarIcon: BalanceIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
interface navButtonProps {
  color: string;
  focused: boolean;
}
const useRenderIcon = (IconComponent: any) =>
  useMemo(() => {
    return ({ color, focused }: navButtonProps) => (
      <View style={{}}>
        <View
          style={[
            styles.NavIcon,
            { backgroundColor: focused ? "#e0e0eb" : "#f1f5f9" },
          ]}
        >
          <IconComponent color={color} weight={focused ? "fill" : "regular"} />
        </View>
      </View>
    );
  }, [IconComponent]);

const styles = StyleSheet.create({
  NavIcon: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    position: "relative",
    paddingBlock: 14,
    paddingInline: 16,
    marginBottom: 8,
  },
});
