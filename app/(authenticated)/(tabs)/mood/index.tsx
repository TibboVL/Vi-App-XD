import { ViButton } from "@/components/ViButton";
import {
  safeAreaEdges,
  safeAreaStyles,
  TextColors,
  textStyles,
} from "@/globalStyles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, InteractionManager } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Mood } from "@/types/mood";
import { EnergyLevel, EnergyMappings } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";

interface CurrentCheckin {
  checkinId: number;
  validAtDate: string | null;
  moodId: number;
  energy: number;
  mood: string;
  parentMoodId: number;
}

export default function MoodScreen() {
  const [loading, setLoading] = useState(true);
  const [daysAgo, setDaysAgo] = useState<number | null>(null);
  const [lastKnownValidCheckin, setLastKnownValidCheckin] =
    useState<CurrentCheckin | null>(null);
  const { getCredentials } = useAuth0();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  async function fetchMoods() {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;

      const query = `${API_URL}/checkin/lastValidCheckin`;
      const response = await fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // this user has never done a checkin!!
      // technically this shouldnt happen because the onboarding requires them to register a first checkin
      if (response.status == 204) {
        setLastKnownValidCheckin(null);
      } else {
        const data = await response.json();
        setLastKnownValidCheckin(data.data as CurrentCheckin);
      }
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch : ", error);
    }
  }

  function getDaysAgo(checkinDateString: string | null) {
    if (!checkinDateString) return null;
    const checkinDate = new Date(checkinDateString);
    const now = new Date();
    const diffTime = now.getTime() - checkinDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function mapEnergyToFriendly() {
    return lastKnownValidCheckin
      ? Object.entries(EnergyLevel)
          .find(
            (energyLevel) =>
              energyLevel[0] ==
              Object.entries(EnergyMappings).find(([key, value]) => {
                if (
                  lastKnownValidCheckin.energy >= value.min &&
                  lastKnownValidCheckin?.energy <= value.max
                ) {
                  return key;
                }
                return;
              })?.[0]
          )?.[1]
          .toLowerCase()
      : null;
  }

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchMoods();
    });

    return () => {
      if (task) {
        task.cancel();
      }
    };
  }, []);
  useEffect(() => {
    if (lastKnownValidCheckin?.validAtDate) {
      setDaysAgo(getDaysAgo(lastKnownValidCheckin.validAtDate));
    }
  }, [lastKnownValidCheckin]);

  function handleStartCheckin() {
    router.push("/mood/moodPicker");
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.Container}>
        {!loading ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              //backgroundColor: "red",
              paddingBlock: 64,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                //backgroundColor: "red",
              }}
            >
              <Text>TODO</Text>
              <Text>Vito here</Text>
              <Text>Battery here</Text>
            </View>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              Last time you checked in you were feeling
            </Text>
            <Text
              style={[
                textStyles.h4,
                {
                  textAlign: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: 800,
                }}
              >
                {lastKnownValidCheckin?.mood.toLowerCase()}
              </Text>{" "}
              with a{" "}
              <Text
                style={{
                  fontWeight: 800,
                }}
              >
                {mapEnergyToFriendly()}
              </Text>{" "}
              energy level.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Viloader vitoMessage="Vito is reading your checkin history!" />
          </View>
        )}
      </View>
      <View style={styles.BottomContainer}>
        <View
          style={{
            paddingBlock: 32,
            position: "absolute",
            flex: 1,
            //backgroundColor: "red",
            bottom: 64 + 16 + 64,
            left: 0,
            right: 0,
          }}
        >
          {daysAgo && daysAgo != 0 ? (
            <View>
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                    display: daysAgo ?? 0 > 0 ? "flex" : "none",
                  },
                ]}
              >
                Your last check-in was{" "}
                <Text
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {daysAgo} day
                  {daysAgo > 1 ? "s" : ""}
                </Text>{" "}
                ago.
              </Text>
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                    display: daysAgo ?? 0 > 0 ? "flex" : "none",
                  },
                ]}
              >
                A new check-in helps Vi give better suggestions.
              </Text>
            </View>
          ) : (
            <View
              style={{
                display: daysAgo == 0 ? "flex" : "none",
              }}
            >
              <Text
                style={[
                  TextColors.muted,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                Still feel the same, or has it changed?
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            gap: 8,
          }}
        >
          <ViButton
            type="text-only"
            title="Review activities"
            onPress={() => {
              router.push("/mood/activityReview");
            }}
          />
          <ViButton
            title={
              daysAgo == 0 ? "Update todays check-in" : "Start daily check-in"
            }
            onPress={handleStartCheckin}
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
    flexDirection: "column",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
