import { StyleSheet, View, Text, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import Auth0, { useAuth0, Auth0Provider } from "react-native-auth0";
import { ViButton } from "@/components/ViButton";
import * as Svg from "react-native-svg";
import ViSVGLogo from "@/components/ViSVGLogo";
const globStyles = require("../globalStyles");

export default function WelcomeScreen() {
  const { authorize, clearSession, user, error, getCredentials } = useAuth0();

  const handleLogin = async () => {
    // try {
    //   await authorize();
    // } catch (e) {
    //   console.log(e);
    // }

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

  const sendAPICall = async () => {
    try {
      const creds = await getCredentials();
      const accessToken = creds!.accessToken;
      if (!accessToken) {
        console.warn("No access token available");
        return;
      }

      const res = await fetch(
        "https://vi-backend-xd.onrender.com/api/v1/users",
        {
          method: "POST", // or POST if you need a body
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            username: "test",
          }),
        }
      );

      if (res.ok) {
        console.log("API success:", await res.json());
      } else {
        console.error("API error:", res.status, await res.text());
      }
    } catch (e) {
      console.error("sendAPICall failed:", e);
    }
  };

  return (
    <SafeAreaView>
      <View style={[styles.Container]}>
        <ViSVGLogo />
        <View>
          {user ? (
            <Text>Logged in as {user.name}</Text>
          ) : (
            <Text>Not logged in</Text>
          )}
          {error ? <Text>{error.message}</Text> : null}
        </View>
        <View style={{ width: "100%", gap: 8, paddingBottom: 64 }}>
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
        </View>
        <ViButton
          // enabled={user != null}
          variant="secondary"
          type="light"
          title="To App"
          onPress={() => router.replace("/(authenticated)/(tabs)/discover")}
        />
        <ViButton
          variant="secondary"
          type="light"
          title="test api call with token"
          onPress={sendAPICall}
        />
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
    height: "40%",
    // height: "100%",
  },
});
