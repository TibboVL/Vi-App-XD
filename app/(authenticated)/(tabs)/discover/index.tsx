import { ViButton } from "@/components/ViButton";
import { StyleSheet, View, Text, ScrollView, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, SplashScreen } from "expo-router";
import {
  getLocation,
  getReverseGeocodedLocation,
} from "@/helpers/locationHelper";
import { useEffect, useState } from "react";
import { LocationGeocodedAddress, LocationObject } from "expo-location";
import { TextColors, textStyles } from "@/globalStyles";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";
import { ActivitySuggestion } from "@/types/activity";
import { FlatList } from "react-native-gesture-handler";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import { Viloader } from "@/components/ViLoader";
import { timeDifference } from "@/helpers/dateTimeHelpers";
SplashScreen.preventAutoHideAsync();

export default function DiscoverScreen() {
  const { getCredentials } = useAuth0();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const [loading, setLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [activitySuggestionList, setActivitySuggestionList] = useState<
    ActivitySuggestion[]
  >([]);

  const fetchExistingSuggestions = async () => {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;

      console.log(userLocation);
      if (!userLocation?.coords.longitude || !userLocation?.coords.latitude) {
        console.warn("Location not found!!");
        return;
      }
      const query = `${API_URL}/activitySuggestions?d=1&lon=${userLocation?.coords.longitude.toString()}&lat=${userLocation?.coords.latitude.toString()}`;
      console.log(query);
      const response = await fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch:", response);
        ToastAndroid.show(
          `Failed to load: ${response.status}`,
          ToastAndroid.SHORT
        );
        return;
      }

      const data = await response.json();
      setActivitySuggestionList(data.data as ActivitySuggestion[]);
      //console.log(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      ToastAndroid.show("Network error while fetching", ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchLocation() {
      const res = await getLocation();
      setUserLocation(res); // triggers the effect below
    }
    fetchLocation();
  });

  useEffect(() => {
    fetchExistingSuggestions();
  }, [userLocation]);
  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
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
            <Viloader vitoMessage="Vito is gathering your reccomendation" />
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
            <View>
              {activitySuggestionList?.length > 0 ? (
                <Text
                  style={[
                    TextColors.muted,
                    {
                      textAlign: "center",
                    },
                  ]}
                >
                  Last updated{" "}
                  <Text
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {activitySuggestionList[0]?.created_at
                      ? timeDifference(
                          new Date(activitySuggestionList[0]?.created_at)
                        )
                      : "N/A"}
                  </Text>
                </Text>
              ) : null}
            </View>
            <FlatList
              data={activitySuggestionList}
              keyExtractor={(item) => item.activityId.toString()}
              style={styles.FlatListStyles}
              contentContainerStyle={{
                gap: 8,
              }}
              renderItem={({ item }) => (
                <ViActivitySuggestion
                  activity={item.activity}
                  activitySuggestion={item}
                />
              )}
              ListEmptyComponent={<Text>Something went wrong!</Text>}
            />
          </View>
        )}

        <View style={[styles.BottomContainer]}>
          <ViButton
            title="See Non-Personalized Activities"
            variant="primary"
            type="light"
            onPress={() => {
              router.push({
                pathname: "/discover/activities",
              });
            }}
          />
          <ViButton
            title="force refetch"
            variant="danger"
            type="light"
            onPress={() => {
              fetchExistingSuggestions();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },

  FlatListStyles: {
    width: "100%",
    height: "100%",
    gap: 8,
    marginBlock: 0,
    paddingInline: 16,
    flexDirection: "column",
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
