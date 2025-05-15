import { ViButton } from "@/components/ViButton";
import { ViInput } from "@/components/ViInput";
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
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
const globStyles = require("../../../../../globalStyles");

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
    <SafeAreaView>
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
              <Text style={[globStyles.h3, { textTransform: "capitalize" }]}>
                {user ? user.name : "NOT LOGGED IN"}
              </Text>
            </View>
            <ViInput label="Username" />
            <ViInput label="Email" />
            <Text style={globStyles.h3}>Password & Authentication </Text>
            <ViButton
              title="Change password"
              variant="primary"
              type="outline"
            />
            <Text style={globStyles.h3}>Account removal </Text>
            <ViButton title="Disable account" variant="danger" type="outline" />
            <ViButton title="Delete account" variant="danger" type="light" />
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
