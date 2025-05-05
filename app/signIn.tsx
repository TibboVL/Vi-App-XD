import { StyleSheet, View, Text, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { ViButton } from "@/components/ViButton";
import * as Svg from "react-native-svg";
import ViSVGLogo from "@/components/ViSVGLogo";
const globStyles = require("../globalStyles");

export default function WelcomeScreen() {
  const { authorize, clearSession, user, error } = useAuth0();

  const handleLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
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
          onPress={() => router.replace("/(authenticated)/(tabs)")}
        />

        {/* <Button onPress={handleLogout} title="Log out" /> */}
        {/* <ViButton
          variant="secondary"
          title="My Vi button"
          onPress={() => console.log("pressed")}
        />
        <ViButton
          variant="danger"
          title="My Vi button"
          onPress={() => console.log("pressed")}
        />
        <ViButton title="My Vi button" onPress={() => console.log("pressed")} />
        <ViButton
          title="My Vi button"
          type="outline"
          onPress={() => console.log("pressed")}
        />
        <ViButton
          title="My Vi button"
          type="text-only"
          onPress={() => console.log("pressed")}
        /> */}
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
