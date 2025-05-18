import { ViButton } from "@/components/ViButton";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";

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
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
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
            {local.debugUITId ? (
              <ViButton
                title="COPY DEBUG URL"
                type="light"
                variant="danger"
                onPress={async () =>
                  await Clipboard.setStringAsync(local.debugUITId.toString())
                }
              />
            ) : (
              /*    <Link href={local.debugUITId as ExternalPathString}>
                  DEBUG URL - {local.debugUITId}
                </Link> */
              <Text>Hardcoded activity</Text>
            )}
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
