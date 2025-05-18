import { textStyles } from "@/globalStyles";
import { Link } from "expo-router";
import { Gear } from "phosphor-react-native";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useAuth0();

  return (
    <SafeAreaView>
      <View style={[styles.Container]}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
              }}
              src={user ? user.picture : undefined}
            />
            <Text
              style={[
                textStyles.h3,
                { textTransform: "capitalize", width: "100%" },
              ]}
            >
              {user ? user.name : "NOT LOGGED IN"}
            </Text>
          </View>

          <Link href={"/(authenticated)/(tabs)/profile/settings"}>
            <View
              style={{
                height: 44,
                width: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Gear size={32} style={{}} />
            </View>
          </Link>
        </View>
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
