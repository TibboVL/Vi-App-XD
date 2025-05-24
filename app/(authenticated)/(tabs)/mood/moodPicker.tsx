import { ViToggleButton } from "@/components/ViToggleButton";
import { safeAreaEdges, safeAreaStyles } from "@/globalStyles";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Mood } from "@/types/mood";
import { VitoAnimatedMoods } from "@/components/VitoAnimatedMoods";
import { ViButton } from "@/components/ViButton";
import { router } from "expo-router";

export default function MoodPickerScreen() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrimaryMood, setSelectedPrimaryMoodMood] =
    useState<Number | null>(null);
  const [selectedSecondaryMood, setSelectedSecondaryMoodMood] =
    useState<Number | null>(null);
  const { getCredentials } = useAuth0();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  function toggleMood(stage: "primary" | "secondary", mood: number) {
    if (stage == "primary") {
      selectedPrimaryMood == mood
        ? setSelectedPrimaryMoodMood(null)
        : setSelectedPrimaryMoodMood(mood);
      setSelectedSecondaryMoodMood(null);
    } else {
      selectedSecondaryMood == mood
        ? setSelectedSecondaryMoodMood(null)
        : setSelectedSecondaryMoodMood(mood);
    }
  }
  async function fetchMoods() {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;

      const query = `${API_URL}/moods`;
      const response = await fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      setMoods(data.data as Mood[]);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch moods: ", error);
    }
  }

  useEffect(() => {
    fetchMoods();
  }, []);

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
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
            .filter((mood) => mood.moodId == selectedPrimaryMood)
            .map((primaryMood) => (
              <View key={primaryMood.moodId}>
                <ViToggleButton
                  title={primaryMood.label}
                  state={selectedPrimaryMood == primaryMood.moodId}
                  onPress={() => toggleMood("primary", primaryMood.moodId)}
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
          <VitoAnimatedMoods />
        </View>
        <View
          id="PrimaryMoods"
          style={[
            styles.MoodButtonContainer,
            { display: selectedPrimaryMood ? "none" : "flex" },
          ]}
        >
          {moods
            .filter((mood) => mood.parentMoodId == null)
            .map((primaryMood) => {
              return (
                <View key={primaryMood.moodId}>
                  <ViToggleButton
                    title={primaryMood.label}
                    state={selectedPrimaryMood == primaryMood.moodId}
                    onPress={() => toggleMood("primary", primaryMood.moodId)}
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
            .filter((mood) => mood.parentMoodId == selectedPrimaryMood)
            .map((secondaryMood) => {
              return (
                <View key={secondaryMood.moodId}>
                  <ViToggleButton
                    title={secondaryMood.label}
                    state={selectedSecondaryMood == secondaryMood.moodId}
                    onPress={() =>
                      toggleMood("secondary", secondaryMood.moodId)
                    }
                  />
                </View>
              );
            })}
        </View>
        <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
          <ViButton
            style={{
              display: selectedSecondaryMood ? "flex" : "none",
            }}
            title="Continue"
            variant="primary"
            type="light"
            onPress={() => {
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
