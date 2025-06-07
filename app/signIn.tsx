import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth0 } from "react-native-auth0";
import { ViButton } from "@/components/ViButton";
import ViSVGLogo from "@/components/ViSVGLogo";
import { useGetUserExists } from "@/hooks/useUser";
import { useEffect } from "react";

export default function WelcomeScreen() {
  const { authorize, user, error } = useAuth0();

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

  const {
    data,
    isLoading,
    error: getUserError,
  } = useGetUserExists({
    enabled: user != null,
  });

  useEffect(() => {
    if (!user || isLoading || !data) return;

    if (!isLoading && data?.exists === false) {
      // user does not exist -> show onboarding
      router.replace("/onboarding");
    } else if (!isLoading && data?.exists === true) {
      // user exists -> go to home
      router.replace("/(authenticated)/(tabs)/discover");
    }
  }, [user, isLoading, data]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
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
          <View>
            {getUserError ? (
              <Text
                style={{
                  paddingBlock: 16,
                  color: "red",
                }}
              >
                An error while checking if user exists: {getUserError.message}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ width: "100%", paddingBlock: 32, gap: 8 }}>
          <ViButton
            enabled={!user}
            variant="primary"
            title="Log in / Register"
            onPress={handleLogin}
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
    flex: 1,
  },
  Image: {
    flex: 1,
    height: "40%",
    //height: "100%",
  },
});
