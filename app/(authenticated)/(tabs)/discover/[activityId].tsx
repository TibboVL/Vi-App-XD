import { ViButton } from "@/components/ViButton";
import { ViInput } from "@/components/ViInput";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
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
const globStyles = require("../../../../globalStyles");

export default function ActivityDetailsScreen() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();
  console.log(
    "Local:",
    local.activityId,
    local.title,
    "Global:",
    glob.activityId
  );
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
                flex: 1,
                flexDirection: "row",
                gap: 3,
              }}
            >
              <Text>Fetching activity</Text>
              <Text
                style={{
                  fontWeight: "900",
                }}
              >
                #{local.activityId} -
              </Text>
              <Text
                style={{
                  fontWeight: "900",
                }}
              >
                {local.title}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.BottomContainer]}>
          <ViButton title="Google more" variant="primary" type="outline" />
          <ViButton title="Add to agenda" variant="primary" type="light" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    // alignItems: "flex-start",
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
