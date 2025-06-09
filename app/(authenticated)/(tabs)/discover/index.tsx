import { ViButton } from "@/components/ViButton";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, SplashScreen } from "expo-router";
import { getLocation } from "@/helpers/locationHelper";
import { useEffect, useState } from "react";
import { LocationObject } from "expo-location";
import { BackgroundColors, TextColors, textStyles } from "@/globalStyles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import { Viloader } from "@/components/ViLoader";
import { timeDifference } from "@/helpers/dateTimeHelpers";
import {
  useGenerateNewSuggestedActivities,
  useGetSuggestedActivities,
} from "@/hooks/useSuggestedActivities";
import VitoError from "@/components/ViErrorHandler";
import { useAuth0 } from "react-native-auth0";
import { Repeat } from "phosphor-react-native";
import { adjustLightness } from "@/constants/Colors";
import { mapEnergyToFriendly } from "@/helpers/energyToFriendlyHelper";
import { ExtendedCheckin } from "@/types/checkin";
import { AISuggestionResponse } from "@/types/activity";
SplashScreen.preventAutoHideAsync();

export default function DiscoverScreen() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [latestSuggestions, setLatestSuggestions] =
    useState<AISuggestionResponse>();

  const {
    // isLoading: initialExistingSuggestions,
    isFetching: loadingExistingSuggestions,
    data: existingResults,
    error: gettingExistingSuggestionsError,
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
  const {
    data: generationResults,
    isFetching: generatingSuggestions,
    error: generationError,
    refetch: generationRefetch,
  } = useGenerateNewSuggestedActivities({
    enabled: false,
    lon: userLocation?.coords.longitude,
    lat: userLocation?.coords.latitude,
  });
  useEffect(() => {
    if (existingResults) {
      setLatestSuggestions(existingResults);
    }
  }, [existingResults]);
  useEffect(() => {
    if (generationResults) {
      setLatestSuggestions(generationResults);
    }
  }, [generationResults]);

  var dateOptions = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;

  function getCheckinTimeDisplay(checkin: ExtendedCheckin) {
    const date = new Date(checkin.plannedEnd ?? checkin.createdAt!);
    const time = date.toLocaleTimeString("en-be", dateOptions);
    const diff = timeDifference(date);
    return `${time} ${diff}`;
  }

  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <View style={{ flex: 1, height: "100%" }}>
          {loadingExistingSuggestions ? (
            <Viloader message="Vito is gathering your reccomendation" />
          ) : null}
          {generatingSuggestions ? (
            <Viloader message="Vito is looking for the perfect activities for you!" />
          ) : null}
          {gettingExistingSuggestionsError ? (
            <VitoError
              error={gettingExistingSuggestionsError}
              loading={loadingExistingSuggestions}
              refetch={refetch}
            />
          ) : null}
          {generationError ? (
            <VitoError
              error={generationError}
              loading={generatingSuggestions}
              refetch={generationRefetch}
            />
          ) : null}
          {!loadingExistingSuggestions &&
          !gettingExistingSuggestionsError &&
          !generatingSuggestions &&
          !generationError &&
          latestSuggestions?.activitySuggestionList ? (
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
                <View>
                  <Text
                    style={[
                      TextColors.muted,
                      {
                        paddingInline: 16,
                        paddingBlock: 8,
                        textAlign: "center",
                      },
                    ]}
                  >
                    Because you felt{" "}
                    {(
                      latestSuggestions.basedOnCheckin.afterMood ??
                      latestSuggestions.basedOnCheckin.beforeMood
                    ).toLowerCase()}{" "}
                    with{" "}
                    {mapEnergyToFriendly(
                      latestSuggestions.basedOnCheckin.afterEnergyLevel ??
                        latestSuggestions.basedOnCheckin.beforeEnergyLevel
                    )}{" "}
                    energy at{" "}
                    {getCheckinTimeDisplay(latestSuggestions.basedOnCheckin)}
                  </Text>
                </View>
                {latestSuggestions.activitySuggestionList?.length > 0 ? (
                  <Text
                    style={[
                      TextColors.muted,
                      {
                        paddingBlock: 8,
                        textAlign: "center",
                      },
                    ]}
                  >
                    Generated{" "}
                    <Text
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {latestSuggestions.activitySuggestionList[0]?.created_at
                        ? timeDifference(
                            new Date(
                              latestSuggestions.activitySuggestionList[0]?.created_at
                            )
                          )
                        : "N/A"}
                    </Text>
                  </Text>
                ) : null}
              </View>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={loadingExistingSuggestions}
                    onRefresh={refetch}
                  />
                }
                data={latestSuggestions.activitySuggestionList}
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
        </View>

        <View style={[styles.BottomContainer]}>
          <View>
            <Text
              style={[
                textStyles.bodySmall,
                {
                  position: "absolute",
                  zIndex: 10,
                  backgroundColor: adjustLightness(
                    BackgroundColors.primary.backgroundColor,
                    20
                  ),
                  height: 16,
                  aspectRatio: 1,
                  textAlign: "center",
                  justifyContent: "center",
                  borderRadius: 1000,
                  top: 6,
                  right: 6,
                },
              ]}
            >
              {latestSuggestions
                ? latestSuggestions!.subscriptionStatus.subscription
                    .maxAIRequestsPerDay -
                  latestSuggestions!.subscriptionStatus.usage
                : "N/A"}
            </Text>
            <ViButton
              enabled={!loadingExistingSuggestions && !generatingSuggestions}
              title="Update suggestions"
              variant="primary"
              type="light"
              hideText={true}
              Icon={Repeat}
              onPress={() => generationRefetch()}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
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
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
