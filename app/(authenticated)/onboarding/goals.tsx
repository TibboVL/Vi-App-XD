import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViButton } from "@/components/ViButton";
import { textStyles } from "@/globalStyles";
import {
  VitoAnimatedMoods,
  VitoAnimatedMoodHandles,
} from "@/components/VitoAnimatedMoods";
import { router, useNavigation } from "expo-router";
import {
  CheckinContextAction,
  useCheckinDispatch,
} from "../(tabs)/mood/checkinContext";
import { useGetCurrentGoals, useGetGoals, useSetGoals } from "@/hooks/useGoals";
import { Viloader } from "@/components/ViLoader";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";

export default function GoalsScreen() {
  const params = useLocalSearchParams();
  const { viaOnboarding = true } = params;

  const vitoMoodRef = useRef<VitoAnimatedMoodHandles>(null);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const dispatch = useCheckinDispatch();

  const { isLoading, data, error } = useGetGoals();
  const {
    isLoading: currentIsLoading,
    data: currentData,
    error: currentError,
  } = useGetCurrentGoals({
    enabled: viaOnboarding == "false",
  });

  useEffect(() => {
    if (vitoMoodRef.current) {
      if (selectedGoals.length > 0) {
        vitoMoodRef.current.setMood("happy");
      } else {
        vitoMoodRef.current.setMood("default");
      }
    }
  }, [selectedGoals]);
  useEffect(() => {
    if (currentData) {
      setSelectedGoals(currentData.map((goal) => goal.goalId));
    }
  }, [currentData]);

  const handleGoalPress = (goal: number) => {
    setSelectedGoals((prevSelectedGoals) => {
      if (prevSelectedGoals.includes(goal)) {
        return prevSelectedGoals.filter((item) => item !== goal);
      } else {
        return [...prevSelectedGoals, goal];
      }
    });
  };

  const queryClient = useQueryClient();
  // TODO Add better pending and error handling here for the user
  const { mutate, isPending, error: postError } = useSetGoals();
  async function handleContinue() {
    mutate(
      {
        goalIds: selectedGoals,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["current-goals"],
            refetchType: "active",
          }); // we added a freestanding checkin so we want to invalidate the cache of the query so our mood screen updates
          if (viaOnboarding == "false") {
            router.replace("/profile/");
          } else {
            dispatch({
              action: CheckinContextAction.SET_ONBOARDING,
              payload: true,
            });
            //! this is a hacky way to get the navbar to update itself and hide properly!
            router.replace("/mood");
            setTimeout(() => {
              router.push("/mood/moodPicker");
            });
          }
        },
      }
    );
  }

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
          {isLoading ? <Viloader message="One moment!" /> : null}
          {data &&
            !isLoading &&
            !error &&
            data.map((goal) => (
              <View key={goal.goalId} style={styles.goalButtonWrapper}>
                <ViButton
                  title={goal.label}
                  type={
                    selectedGoals.includes(goal.goalId) ? "light" : "outline"
                  }
                  variant="primary"
                  onPress={() => handleGoalPress(goal.goalId)}
                  contentStyle={styles.goalButton}
                />
              </View>
            ))}
        </View>

        <View style={styles.bottomButtonContainer}>
          <ViButton
            title={selectedGoals.length === 0 ? "Skip" : "Continue"}
            onPress={handleContinue}
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
    paddingHorizontal: 12,
  },
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 20,
  },
});
