import { ViToggleButton } from "@/components/ViToggleButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ToastAndroid } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Mood } from "@/types/mood";
import { ViButton } from "@/components/ViButton";
import { router, useNavigation } from "expo-router";
import {
  useCheckinDispatch,
  useCheckinState,
  CheckinContextAction,
  ReviewStage,
} from "./checkinContext";
import ContextDebugView from "./checkinContextDebug";
import {
  VitoAnimatedMoodHandles,
  VitoAnimatedMoods,
  VitoEmoteConfig,
} from "@/components/VitoAnimatedMoods";
import { useGetMoods } from "@/hooks/useMoods";

export default function MoodPickerScreen() {
  const state = useCheckinState();
  const dispatch = useCheckinDispatch();

  const [selectedPrimaryMood, setSelectedPrimaryMoodMood] =
    useState<Number | null>(null);
  const [selectedSecondaryMood, setSelectedSecondaryMoodMood] =
    useState<Number | null>(null);

  const emoteManagerRef = useRef<VitoAnimatedMoodHandles>(null);

  function toggleMood(stage: "primary" | "secondary", mood: Mood) {
    console.log(mood);
    if (stage == "primary") {
      if (selectedPrimaryMood == mood.moodId) {
        setSelectedPrimaryMoodMood(null);
        emoteManagerRef.current?.setMood("default");
      } else {
        setSelectedPrimaryMoodMood(mood.moodId);
        emoteManagerRef.current?.setMood(
          mood.label.toLowerCase() as keyof VitoEmoteConfig
        );
      }

      setSelectedSecondaryMoodMood(null);
    } else {
      selectedSecondaryMood == mood.moodId
        ? setSelectedSecondaryMoodMood(null)
        : setSelectedSecondaryMoodMood(mood.moodId);
    }
  }

  const updateChosenMoodId = () => {
    //if (router.canDismiss()) router.dismissAll();

    dispatch({
      action:
        // if on stage before or stage null, set before, else set after
        state.reviewStage == ReviewStage.BEFORE || state.reviewStage == null
          ? CheckinContextAction.SET_MOOD_BEFORE
          : CheckinContextAction.SET_MOOD_AFTER,
      payload: selectedSecondaryMood,
    });
  };

  const { isLoading: loading, data: moods, error } = useGetMoods();

  const navigation = useNavigation();

  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      ToastAndroid.show("Please complete the checkin", ToastAndroid.SHORT);
    });

    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <ContextDebugView />

      <View style={[styles.Container]}>
        <View
          id="ChosenPrimaryEmotion"
          style={{
            //backgroundColor: "red",
            minHeight: 70,
            marginBlock: 32,
            marginInline: "auto",
            justifyContent: "center",
          }}
        >
          {moods
            ?.filter((mood) => mood.moodId == selectedPrimaryMood)
            .map((primaryMood) => (
              <View key={primaryMood.moodId}>
                <ViToggleButton
                  title={primaryMood.label}
                  state={selectedPrimaryMood == primaryMood.moodId}
                  onPress={() => toggleMood("primary", primaryMood)}
                />
              </View>
            ))}
          <Text></Text>
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <VitoAnimatedMoods ref={emoteManagerRef} />
        </View>
        <View
          id="PrimaryMoods"
          style={[
            styles.MoodButtonContainer,
            { display: selectedPrimaryMood ? "none" : "flex" },
          ]}
        >
          {moods
            ?.filter((mood) => mood.parentMoodId == null)
            .map((primaryMood) => {
              return (
                <View key={primaryMood.moodId}>
                  <ViToggleButton
                    title={primaryMood.label}
                    state={selectedPrimaryMood == primaryMood.moodId}
                    onPress={() => toggleMood("primary", primaryMood)}
                  />
                </View>
              );
            })}
        </View>
        <View
          id="SecondaryMoods"
          style={[
            styles.MoodButtonContainer,
            { display: !selectedPrimaryMood ? "none" : "flex" },
          ]}
        >
          {moods
            ?.filter((mood) => mood.parentMoodId == selectedPrimaryMood)
            .map((secondaryMood) => {
              return (
                <View key={secondaryMood.moodId}>
                  <ViToggleButton
                    title={secondaryMood.label}
                    state={selectedSecondaryMood == secondaryMood.moodId}
                    onPress={() => toggleMood("secondary", secondaryMood)}
                  />
                </View>
              );
            })}
        </View>

        <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
          <ViButton
            innerStyle={{
              display: selectedSecondaryMood ? "flex" : "none",
            }}
            title="Continue"
            variant="primary"
            type="light"
            onPress={() => {
              updateChosenMoodId();
              router.push({
                pathname: "/mood/energyPicker",
              });
            }}
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
    //gap: 8,
    flex: 1,
  },
  MoodButtonContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignContent: "center",
    justifyContent: "center",
    //backgroundColor: "#00FF00",
    minHeight: 60 * 4.5,

    padding: 16,
    paddingTop: 64,
    // paddingBottom: 32,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    minHeight: 90,
    //backgroundColor: "blue",
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
});
