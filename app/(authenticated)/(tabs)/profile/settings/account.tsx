import {
  BellRinging,
  CaretRight,
  Code,
  Gear,
  Icon,
  IconProps,
  Palette,
  ThumbsUp,
  User,
} from "phosphor-react-native";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
const globStyles = require("../../../../../globalStyles");

export default function SettingsScreen() {
  const { user } = useAuth0();

  return (
    <SafeAreaView>
      <View style={[styles.Container]}>
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
          <Text style={[globStyles.h3, { textTransform: "capitalize" }]}>
            {user ? user.name : "NOT LOGGED IN"}
          </Text>
        </View>
        <Text>My account </Text>
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
