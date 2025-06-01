import { Tabs, useSegments } from "expo-router";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Calendar, Compass, Scales, Smiley, User } from "phosphor-react-native";
import { CheckinProvider } from "./mood/checkinContext";

export default function TabLayout() {
  const segments = useSegments(); // console.log(pathname);

  const isRootTab = useMemo(() => {
    return segments.length <= 3; // ["(authenticated)", "(tabs)", "HERE"] hide navbar on anything beyond these
  }, [segments]);

  return (
    <CheckinProvider>
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
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
              height: 80,
              backgroundColor: "#f1f5f9",
              display: isRootTab ? "flex" : "none",
            },
            android: {
              height: 80,
              backgroundColor: "#f1f5f9",
              paddingInline: 12,
              display: isRootTab ? "flex" : "none",
            },
          }),
        }}
      >
        <Tabs.Screen name="index" options={{ headerShown: false }} redirect />
        <Tabs.Screen
          name="discover"
          options={{
            title: "Discover",
            tabBarIcon: renderIcon(Compass),
          }}
        />
        <Tabs.Screen
          name="planning"
          options={{
            title: "Planning",
            tabBarIcon: renderIcon(Calendar),
          }}
        />
        <Tabs.Screen
          name="mood"
          options={{
            title: "Mood",
            tabBarIcon: renderIcon(Smiley),
          }}
        />
        <Tabs.Screen
          name="balance"
          options={{
            title: "Balance",
            tabBarIcon: renderIcon(Scales),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: renderIcon(User),
          }}
        />
      </Tabs>
    </CheckinProvider>
  );
}
interface navButtonProps {
  color: string;
  focused: boolean;
}
const renderIcon = (IconComponent: any) => {
  return ({ color, focused }: navButtonProps) => (
    <View
      style={[
        styles.NavIcon,
        { backgroundColor: focused ? "#e0e0eb" : "#f1f5f9" },
      ]}
    >
      <IconComponent color={color} weight={focused ? "fill" : "regular"} />
    </View>
  );
};

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
