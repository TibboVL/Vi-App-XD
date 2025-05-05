import { StyleSheet, View, Text, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function RegisterScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text style={{ color: "black" }}>New user - registering</Text>
        <Image source={require("../assets/images/ViLogo.png")} />
        <Button title="Register" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
});
