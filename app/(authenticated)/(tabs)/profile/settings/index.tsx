import { router } from "expo-router";
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
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
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
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingInline: 32,
            paddingBlock: 32,
          }}
        >
          <SettingsTile
            title="My Account"
            icon={User}
            onPress={() =>
              router.push("/(authenticated)/(tabs)/profile/settings/account")
            }
          />
          <SettingsTile title="Notifications" icon={BellRinging} />
          <SettingsTile title="My Activity Ratings" icon={ThumbsUp} />
          <SettingsTile title="Personalization" icon={Palette} />
          <SettingsTile title="About App" icon={Code} />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface settingsTilePorps {
  title: string;
  icon: Icon;
  onPress?: () => void;
}
const SettingsTile = ({ title, icon: Icon, onPress }: settingsTilePorps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Icon />
        <Text style={globStyles.bodyLarge}>{title}</Text>
      </View>
      <CaretRight />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
});
