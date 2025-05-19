import { ViButton } from "@/components/ViButton";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, SplashScreen } from "expo-router";
import { getReverseGeocodedLocation } from "@/helpers/locationHelper";
import { useEffect, useState } from "react";
import { LocationGeocodedAddress } from "expo-location";
import { textStyles } from "@/globalStyles";
SplashScreen.preventAutoHideAsync();

export default function DiscoverScreen() {
  const [address, setAddress] = useState<LocationGeocodedAddress>();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    async function getAddress() {
      const addresses = await getReverseGeocodedLocation();
      setAddress(addresses[0]);
    }
    getAddress();
  });
  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <ScrollView contentContainerStyle={styles.Container}>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "90%",
              gap: 8,
            }}
          >
            <Text
              style={[
                textStyles.h3,
                {
                  textAlign: "center",
                  paddingBlock: 8,
                },
              ]}
            >
              Suggestions for you
            </Text>
            <View>
              <Text>Availible information for personalization (DEBUG)</Text>
              <Text>
                Location: {address?.city} - {address?.postalCode}
              </Text>
              <Text>
                Time&Date: {dateTime.getHours()}:{dateTime.getMinutes()} -{" "}
                {dateTime.getUTCDate()}/{dateTime.getMonth() + 1}
              </Text>
              <Text>Weather: TODO</Text>
            </View>
            {/*  <ViActivitySuggestion
              title="Go on a hike with the CMU Hiking Club"
              tags={[
                { label: "Walking", pillar: "sports" },
                { label: "Mindfulness", pillar: "mindfulness" },
              ]}
              energylevel={EnergyLevel.High}
              duration="30m"
              cost="20"
              distance="5 km"
              shareable={true}
              activityType="hiking"
            />
            <ViActivitySuggestion
              title="Swimming event at the local pool"
              tags={[
                { label: "Swimming", pillar: "sports" },
                { label: "Socializing", pillar: "connections" },
              ]}
              energylevel={EnergyLevel.Medium}
              duration="60m"
              cost="10"
              distance="<1 km"
              shareable={true}
              activityType="swimming"
            />
            <ViActivitySuggestion
              title="Join the CMU Coding Club"
              tags={[
                { label: "Coding", pillar: "skills" },
                { label: "Socializing", pillar: "connections" },
              ]}
              energylevel={EnergyLevel.Low}
              duration="90m"
              cost="Free"
              distance="<1 km"
              shareable={true}
              activityType="coding"
            /> */}
          </View>
        </ScrollView>
        <View style={[styles.BottomContainer]}>
          <ViButton
            title="Explore More Activities"
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
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
