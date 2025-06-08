import { ViButton } from "@/components/ViButton";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, SplashScreen } from "expo-router";
import { getLocation } from "@/helpers/locationHelper";
import { useEffect, useState } from "react";
import { LocationObject } from "expo-location";
import { TextColors } from "@/globalStyles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import { Viloader } from "@/components/ViLoader";
import { timeDifference } from "@/helpers/dateTimeHelpers";
import { useGetSuggestedActivities } from "@/hooks/useSuggestedActivities";
import VitoError from "@/components/ViErrorHandler";
import { useAuth0 } from "react-native-auth0";
SplashScreen.preventAutoHideAsync();

export default function DiscoverScreen() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);

  const {
    isLoading,
    data: activitySuggestionList,
    error,
    refetch,
  } = useGetSuggestedActivities({
    enabled: userLocation?.coords != undefined,
    lon: userLocation?.coords.longitude,
    lat: userLocation?.coords.latitude,
  });
  const { getCredentials } = useAuth0();
  const logToken = async () => {
    const token = await getCredentials();
    console.log(token?.accessToken);
  };

  useEffect(() => {
    async function fetchLocation() {
      const res = await getLocation();
      setUserLocation(res); // triggers the effect below
    }
    logToken();
    fetchLocation();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        {isLoading ? (
          <Viloader message="Vito is gathering your reccomendation" />
        ) : null}
        {error ? (
          <VitoError error={error} loading={isLoading} refetch={refetch} />
        ) : null}
        {!isLoading && !error && activitySuggestionList ? (
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
                      paddingBlock: 8,
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
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
              }
              data={activitySuggestionList}
              keyExtractor={(item) => item.activityId?.toString()}
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
        ) : null}
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
