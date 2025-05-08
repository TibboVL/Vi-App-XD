import { ViButton } from "@/components/ViButton";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text style={{ color: "black" }}>Hello world!</Text>
        <Image source={require("../../../assets/images/ViLogo.png")} />
        <Button title="Hello world!" />
        <ViButton title="Test" />
        <ViButton title="Test" enabled={false} />
        <ViButton title="Test" enabled={false} type="outline" />
        <ViButton
          title="Test"
          type="text-only"
          variant="secondary"
          onPress={() => {
            ToastAndroid.showWithGravity(
              "All Your Base Are Belong To Us",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }}
        />
        <ViButton
          title="Test"
          enabled={false}
          type="outline"
          variant="danger"
        />
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
