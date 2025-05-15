import { router, Tabs, usePathname, useRouter, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Calendar, Compass, Scales, Smiley, User } from "phosphor-react-native";
import Animated from "react-native-reanimated";

export default function TabLayout() {
  const pathname = useSegments();
  // console.log(pathname);
  // console.log(pathname.length > 3);

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
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            height: 80,
            backgroundColor: "#f1f5f9",
            display: pathname.length > 3 ? "none" : "flex",
          },
          android: {
            height: 80,
            backgroundColor: "#f1f5f9",
            paddingInline: 12,
            display: pathname.length > 3 ? "none" : "flex",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} redirect />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                ...styles.NavIcon,
                backgroundColor: focused ? "#e0e0eb" : "#f1f5f9",
              }}
            >
              <Compass color={color} weight={focused ? "fill" : "regular"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: "Planning",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                ...styles.NavIcon,
                backgroundColor: focused ? "#e0e0eb" : "#f1f5f9",
              }}
            >
              <Calendar color={color} weight={focused ? "fill" : "regular"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: "Mood",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                ...styles.NavIcon,
                backgroundColor: focused ? "#e0e0eb" : "#f1f5f9",
              }}
            >
              <Smiley color={color} weight={focused ? "fill" : "regular"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: "Balance",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                ...styles.NavIcon,
                backgroundColor: focused ? "#e0e0eb" : "#f1f5f9",
              }}
            >
              <Scales color={color} weight={focused ? "fill" : "regular"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                ...styles.NavIcon,
                backgroundColor: focused ? "#e0e0eb" : "#f1f5f9",
              }}
            >
              <User color={color} weight={focused ? "fill" : "regular"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

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
