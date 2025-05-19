import { Stack, Redirect, SplashScreen } from "expo-router";
import { View, Text, Image } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: "100%",
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Image
            style={{
              width: 300,
              height: 300,
              objectFit: "contain",
              alignSelf: "center",
            }}
            source={require("../../assets/images/ViSquareLogoPNG.png")}
          />
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Loading
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href={"/signIn"} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable the default header for all screens within this stack
      }}
    ></Stack>
  );
}
