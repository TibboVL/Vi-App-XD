import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth0 } from "react-native-auth0";
import { ViButton } from "@/components/ViButton";
import ViSVGLogo from "@/components/ViSVGLogo";
import { ViDivider } from "@/components/ViDivider";

export default function WelcomeScreen() {
  const { authorize, clearSession, user, error, getCredentials } = useAuth0();

  const handleLogin = async () => {
    try {
      await authorize({
        audience: "https://Vi-Auth-API", // ← EXACT match of your Auth0 API Identifier
        scope: "openid profile email", // add any custom scopes you need
      });
    } catch (e) {
      console.error("Login failed:", e);
    }
  };
  const handleLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <View style={[styles.Container]}>
        <View
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          <ViSVGLogo />
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text>Status</Text>
            {user ? (
              <Text>Logged in as {user.name}</Text>
            ) : (
              <Text>Not logged in</Text>
            )}
            {error ? (
              <Text
                style={{
                  paddingBlock: 16,
                  color: "red",
                }}
              >
                An error occured: {error.message}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ width: "100%", height: "100%", flex: 1, gap: 8 }}>
          <ViButton
            enabled={!user}
            variant="primary"
            title="Log in"
            onPress={handleLogin}
          />
          <ViButton
            enabled={user != null}
            variant="danger"
            type="outline"
            title="Log out"
            onPress={handleLogout}
          />
          <ViDivider />
          <Text>These buttons are for testing</Text>
          <ViButton
            // enabled={user != null}
            variant="secondary"
            type="light"
            title="To App"
            onPress={() => router.replace("/(authenticated)/(tabs)/discover")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingInline: 16,
    alignItems: "center",
    gap: 8,
  },
  Image: {
    flex: 1,
    height: "40%",
    // height: "100%",
  },
});
