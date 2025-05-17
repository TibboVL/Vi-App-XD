import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { act, useEffect, useState } from "react";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";
import { minutesToHoursMinutes } from "@/helpers/dateTimeHelpers";
import {
  Activity,
  EnergyLevel,
  getPillarInfo,
  PillarKey,
  Pillars,
} from "@/types/activity";
import { Viloader } from "@/components/ViLoader";

export default function ActivitiesScreen() {
  const { getCredentials } = useAuth0();
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;
      console.log(accessToken);

      if (!accessToken) {
        console.warn("No access token available");
        ToastAndroid.show(
          "Authentication error: no access token",
          ToastAndroid.SHORT
        );
        return;
      }
      console.log("Fetching from:", `${API_URL}/activities`);
      const response = await fetch(`${API_URL}/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch activities:", response);
        ToastAndroid.show(
          `Failed to load activities: ${response.status}`,
          ToastAndroid.SHORT
        );
        return;
      }

      const data = await response.json();
      setActivityList(data.data as Activity[]);
      console.log(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      ToastAndroid.show(
        "Network error while fetching activities",
        ToastAndroid.SHORT
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: 0 }}
      edges={["left", "right", "bottom"]}
    >
      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Viloader vitoMessage="Vito is looking for more activities..." />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              paddingInline: 16,
              paddingBlock: 16,
            }}
          >
            <Text>Implement filters here</Text>
          </View>
          <FlatList
            data={activityList}
            keyExtractor={(item) => item.activityId.toString()}
            style={styles.Container}
            contentContainerStyle={{
              gap: 8,
            }}
            renderItem={({ item }) => <ViActivitySuggestion activity={item} />}
            ListEmptyComponent={
              <>
                <Text>Something went wrong!</Text>
              </>
            }
          />
          {/* <ScrollView contentContainerStyle={styles.Container}>
            {activityList.map((activity) => {
              return (
                <ViActivitySuggestion
                  key={activity.activityId}
                  activity={activity}
                />
              );
            })}
          </ScrollView> */}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    height: "100%",
    gap: 8,
    marginBlock: 0,
    paddingInline: 16,
    flexDirection: "column",
    /*     alignItems: "flex-start",
     */
  },
});
