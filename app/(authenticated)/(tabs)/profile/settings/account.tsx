import { ViButton } from "@/components/ViButton";
import { ViInput } from "@/components/ViInput";
import { safeAreaEdges, safeAreaStyles, textStyles } from "@/globalStyles";
import { router } from "expo-router";

import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, clearSession } = useAuth0();

  const handleLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <ScrollView style={[styles.Container]}>
          <View
            style={{
              flexDirection: "column",
              gap: 8,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                paddingBlock: 32,
              }}
            >
              <Image
                style={{
                  width: 48 * 3,
                  height: 48 * 3,
                  borderRadius: 999,
                }}
                src={user ? user.picture : undefined}
              />
              <Text style={[textStyles.h3, { textTransform: "capitalize" }]}>
                {user ? user.name : "NOT LOGGED IN"}
              </Text>
            </View>
            <ViInput label="Username" />
            <ViInput label="Email" />
            <Text style={textStyles.h3}>Password & Authentication </Text>
            <ViButton
              title="Change password"
              variant="primary"
              type="outline"
            />
            <Text style={textStyles.h3}>Account removal </Text>
            <ViButton title="Disable account" variant="danger" type="outline" />
            <ViButton title="Delete account" variant="danger" type="light" />
            <ViButton
              title="Force restart onboarding (DEBUG)"
              variant="danger"
              type="light"
              onPress={() => {
                router.push("/(authenticated)/onboarding");
              }}
            />
          </View>
        </ScrollView>
        <View style={[styles.BottomContainer]}>
          <ViButton
            title="Log out"
            variant="primary"
            type="light"
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    gap: 8,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
