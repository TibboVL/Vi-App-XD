import { ViButton } from "@/components/ViButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { router, useNavigation } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCheckinDispatch, useCheckinState } from "./checkinContext";
import { useEffect } from "react";
import { ToastAndroid } from "react-native";
import ContextDebugView from "./checkinContextDebug";

export default function MoodScreen() {
  const insets = useSafeAreaInsets();

  const state = useCheckinState();
  const dispatch = useCheckinDispatch();

  function handleCompleteActivityReview() {
    router.push("/mood/activityReview");
  }

  const navigation = useNavigation();
  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      // e.preventDefault();
      // ToastAndroid.show("Please complete the checkin", ToastAndroid.SHORT);
    });

    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);
  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <View
        style={{
          flex: 1,
          paddingBottom: insets.top,
        }}
      >
        <ContextDebugView />
        <View style={styles.Container}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text>Pros and cons will be filled in here</Text>
          </View>
        </View>
        <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
          <ViButton
            title="Continue"
            variant="primary"
            type="light"
            onPress={handleCompleteActivityReview}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
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
