import { StyleSheet, View, Text, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text style={{ color: "black" }}>Hello world!</Text>
        <Image source={require("../../../assets/images/ViLogo.png")} />
        <Button title="Hello world!" />
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
