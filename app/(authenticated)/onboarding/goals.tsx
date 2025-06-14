// app/(authenticated)/onboarding/goalsScreen.tsx

import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViButton } from "@/components/ViButton";
import { textStyles } from "@/globalStyles";
import {
  VitoAnimatedMoods,
  VitoAnimatedMoodHandles,
  VitoEmoteConfig,
} from "@/components/VitoAnimatedMoods";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const goals = [
  "Be more present",
  "Enhance focus",
  "Increase energy",
  "Awesome sleep",
  "Stress relief",
  "Nurture friendships",
];

export default function GoalsScreen() {
  const vitoMoodRef = useRef<VitoAnimatedMoodHandles>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    if (vitoMoodRef.current) {
      if (selectedGoals.length > 0) {
        vitoMoodRef.current.setMood("happy");
      } else {
        vitoMoodRef.current.setMood("default");
      }
    }
  }, [selectedGoals]);

  useFocusEffect(
    React.useCallback(() => {
      if (vitoMoodRef.current) {
        if (selectedGoals.length > 0) {
          vitoMoodRef.current.setMood("happy");
        } else {
          vitoMoodRef.current.setMood("default");
        }
      }
      return () => {
        if (vitoMoodRef.current) {
          vitoMoodRef.current.setMood("default");
        }
      };
    }, [selectedGoals])
  );

  const handleGoalPress = (goal: string) => {
    setSelectedGoals((prevSelectedGoals) => {
      if (prevSelectedGoals.includes(goal)) {
        return prevSelectedGoals.filter((item) => item !== goal);
      } else {
        return [...prevSelectedGoals, goal];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerWrapper}>
        <View style={styles.header}>
          <Text style={[textStyles.h3, { textAlign: "center" }]}>
            What goals would you like to achieve?
          </Text>
        </View>

        <View style={styles.vitoContainer}>
          <VitoAnimatedMoods ref={vitoMoodRef} />
        </View>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <View key={goal} style={styles.goalButtonWrapper}>
              <ViButton
                title={goal}
                type={selectedGoals.includes(goal) ? "light" : "outline"}
                variant="primary"
                onPress={() => handleGoalPress(goal)}
                style={styles.goalButton}
              />
            </View>
          ))}
        </View>

        <View style={styles.bottomButtonContainer}>
          <ViButton
            title={selectedGoals.length === 0 ? "Skip" : "Continue"}
            onPress={() =>
              router.push({
                pathname: "/(authenticated)/(tabs)/mood/moodPicker",
                params: { fromOnboarding: "true" },
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    marginBottom: 20,
  },
  vitoContainer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  goalsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 10,
  },
  goalButtonWrapper: {
    flexGrow: 0,
    flexBasis: "auto",
  },
  goalButton: {
    paddingHorizontal: 20,
  },
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 20,
  },
});
