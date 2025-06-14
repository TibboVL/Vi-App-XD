import { ViButton } from "@/components/ViButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCheckinDispatch, useCheckinState } from "./checkinContext";
import ContextDebugView from "./checkinContextDebug";
import { CheckinAgendaItemWrapper } from "./activityReview";
import { usePreventUserBack } from "@/hooks/usePreventBack";

export default function MoodScreen() {
  usePreventUserBack();
  const insets = useSafeAreaInsets();

  const state = useCheckinState();
  const dispatch = useCheckinDispatch();

  function handleCompleteActivityReview() {
    router.replace("/mood/activityReview");
  }

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <View
        style={{
          flex: 1,
          paddingBottom: insets.top,
        }}
      >
        <ContextDebugView />
        <CheckinAgendaItemWrapper
          compactUserActivityListItem={state.compactUserActivityListItem}
        />
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
