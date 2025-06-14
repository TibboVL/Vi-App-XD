import { ViButton } from "@/components/ViButton";
import { View, Text, StyleSheet, Dimensions, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  getLocation,
  getReverseGeocodedLocation,
} from "@/helpers/locationHelper";
import { textStyles } from "@/globalStyles";
import { safeAreaEdges } from "../../../globalStyles";
import { Viloader } from "@/components/ViLoader";

export default function OnboardingLocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [reverseGeocodedLocation, setReverseGeocodedLocation] = useState<
    Location.LocationGeocodedAddress[] | null
  >();

  async function getCurrentLocation() {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.showWithGravity(
        "Permission to access location was denied - open app settings to enable it manually",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    setLocation(await getLocation());
    setLoading(false);
  }

  useEffect(() => {
    if (location) {
      async function getAddress() {
        setReverseGeocodedLocation(await getReverseGeocodedLocation());
      }
      getAddress();
    }
    router.push("/(authenticated)/onboarding/notifications");
  }, [location]);

  let text = "Waiting...";
  if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView edges={safeAreaEdges} style={{ flex: 1 }}>
      <View style={styles.Container}>
        <View
          style={{
            width: "100%",
            flex: 4,
            justifyContent: "center",
            alignItems: "center",
            gap: 64,
          }}
        >
          <Text style={[textStyles.h3, { textAlign: "center" }]}>
            Personalized for where you are
          </Text>
          <VitoLocation />
          <Text style={[textStyles.bodyLarge, { textAlign: "center" }]}>
            We suggest activities that match your location, like outdoor walks
            or local weather-friendly options.
          </Text>
          {/* <View>
            <Text>coordinates: {text}</Text>
            <Text>address: {JSON.stringify(reverseGeocodedLocation)}</Text>
          </View> */}
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 24,
            gap: 8,
            width: "100%",
          }}
        >
          <ViButton title="Maybe later" type="text-only" enabled={false} />
          {location == null ? (
            <ViButton
              title="Grant location access"
              onPress={() => getCurrentLocation()}
            />
          ) : (
            <ViButton
              title="Continue"
              onPress={() =>
                router.push("/(authenticated)/onboarding/notifications")
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const VitoLocation = () => {
  return (
    <Svg width={301} height={211} viewBox="0 0 301 211" fill="none">
      <Path
        d="M275.673 96.9126C298.739 16.3795 197.592 -32.2551 104.611 24.819C11.7727 81.8931 64.0657 186.457 123.092 199.474C181.975 212.491 253.466 174.728 275.673 96.9126Z"
        fill="#4DA06D"
      />
      <Circle cx={196} cy={95} r={22} fill="white" />
      <Circle cx={137} cy={95} r={22} fill="white" />
      <Circle cx={191.5} cy={90.5} r={11.5} fill="#626262" />
      <Circle cx={131.5} cy={90.5} r={11.5} fill="#626262" />
      <Path
        d="M153 130.87C160 136 175 136 181 130.87"
        stroke="white"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path
        d="M241.375 121.469C234.906 121.469 229.656 116.219 229.656 109.75C229.656 103.281 234.906 98.0312 241.375 98.0312C247.844 98.0312 253.094 103.281 253.094 109.75C253.094 116.219 247.844 121.469 241.375 121.469ZM241.375 101.594C236.875 101.594 233.219 105.25 233.219 109.75C233.219 114.25 236.875 117.906 241.375 117.906C245.875 117.906 249.531 114.25 249.531 109.75C249.531 105.25 245.875 101.594 241.375 101.594Z"
        fill="#581166"
      />
      <Path
        d="M248.125 124.094H234.531C231.438 124.094 228.906 121.562 228.906 118.469C228.906 115.375 231.438 112.844 234.531 112.844H248.125C251.219 112.844 253.75 115.375 253.75 118.469C253.844 121.562 251.312 124.094 248.125 124.094Z"
        fill="#FF5855"
      />
      <Path
        d="M248.125 125.875H234.531C230.406 125.875 227.125 122.594 227.125 118.469C227.125 114.344 230.406 111.062 234.531 111.062H248.125C252.25 111.062 255.531 114.344 255.531 118.469C255.531 122.594 252.25 125.875 248.125 125.875ZM234.531 114.531C232.375 114.531 230.594 116.312 230.594 118.469C230.594 120.625 232.375 122.406 234.531 122.406H248.125C250.281 122.406 252.063 120.625 252.063 118.469C252.063 116.312 250.281 114.531 248.125 114.531H234.531Z"
        fill="#581166"
      />
      <Path
        d="M240.719 200.875C263.708 200.875 282.344 182.239 282.344 159.25C282.344 136.261 263.708 117.625 240.719 117.625C217.73 117.625 199.094 136.261 199.094 159.25C199.094 182.239 217.73 200.875 240.719 200.875Z"
        fill="#FF5855"
      />
      <G opacity={0.5}>
        <Path
          d="M240.719 197.031C260.187 197.031 275.969 181.249 275.969 161.781C275.969 142.313 260.187 126.531 240.719 126.531C221.251 126.531 205.469 142.313 205.469 161.781C205.469 181.249 221.251 197.031 240.719 197.031Z"
          fill="#581166"
        />
      </G>
      <Path
        d="M240.719 202.656C216.813 202.656 197.312 183.156 197.312 159.25C197.312 135.344 216.813 115.844 240.719 115.844C264.625 115.844 284.125 135.25 284.125 159.25C284.125 183.25 264.625 202.656 240.719 202.656ZM240.719 119.313C218.688 119.313 200.875 137.219 200.875 159.156C200.875 181.094 218.781 199 240.719 199C262.656 199 280.562 181.094 280.562 159.156C280.562 137.219 262.656 119.313 240.719 119.313Z"
        fill="#581166"
      />
      <Path
        d="M240.719 192.625C259.151 192.625 274.094 177.683 274.094 159.25C274.094 140.817 259.151 125.875 240.719 125.875C222.286 125.875 207.344 140.817 207.344 159.25C207.344 177.683 222.286 192.625 240.719 192.625Z"
        fill="white"
      />
      <Path
        d="M240.719 194.312C221.312 194.312 205.562 178.562 205.562 159.156C205.562 139.75 221.312 124.094 240.719 124.094C260.125 124.094 275.875 139.844 275.875 159.25C275.875 178.656 260.031 194.312 240.719 194.312ZM240.719 127.563C223.281 127.563 209.125 141.813 209.125 159.25C209.125 176.688 223.281 190.844 240.719 190.844C258.156 190.844 272.312 176.688 272.312 159.25C272.312 141.813 258.156 127.563 240.719 127.563Z"
        fill="#581166"
      />
      <Path
        d="M258.719 141.906L245.781 163.563L224.031 176.594L236.969 154.844L258.719 141.906Z"
        fill="#FFDA8E"
      />
      <Path
        d="M224.031 178.281C223.562 178.281 223.094 178.094 222.812 177.812C222.25 177.25 222.156 176.406 222.531 175.656L235.469 153.906C235.656 153.625 235.844 153.437 236.031 153.344L257.781 140.406C258.437 140.031 259.375 140.125 259.937 140.687C260.5 141.25 260.594 142.094 260.219 142.844L247.281 164.5C247.094 164.781 246.906 164.969 246.719 165.062L224.875 178.094C224.594 178.281 224.312 178.281 224.031 178.281ZM238.281 156.156L229.094 171.531L244.469 162.344L253.656 146.969L238.281 156.156Z"
        fill="#581166"
      />
      <Path
        d="M240.719 194.312C239.781 194.312 238.938 193.563 238.938 192.531V183.719C238.938 182.781 239.688 181.938 240.719 181.938C241.75 181.938 242.5 182.688 242.5 183.719V192.531C242.5 193.563 241.656 194.312 240.719 194.312Z"
        fill="#581166"
      />
      <Path
        d="M240.719 136.469C239.781 136.469 238.938 135.719 238.938 134.687V125.875C238.938 124.938 239.688 124.094 240.719 124.094C241.75 124.094 242.5 124.844 242.5 125.875V134.687C242.5 135.625 241.656 136.469 240.719 136.469Z"
        fill="#581166"
      />
      <Path
        d="M265.188 160.937C264.25 160.937 263.406 160.187 263.406 159.156C263.406 158.219 264.156 157.375 265.188 157.375H274C274.937 157.375 275.781 158.125 275.781 159.156C275.781 160.094 275.031 160.937 274 160.937H265.188Z"
        fill="#581166"
      />
      <Path
        d="M216.156 160.937H207.344C206.406 160.937 205.562 160.187 205.562 159.156C205.562 158.125 206.312 157.375 207.344 157.375H216.156C217.094 157.375 217.938 158.125 217.938 159.156C217.938 160.187 217.187 160.937 216.156 160.937Z"
        fill="#581166"
      />
      <Rect x={35} y={122} width={49} height={48} fill="white" />
      <Path
        d="M103.094 134.5C97.8941 111.35 77.6941 101 59.9941 101C59.9941 101 59.9941 101 59.9441 101C42.294 101 22.144 111.35 16.894 134.45C10.994 160.25 25.794 182.1 40.094 195.9C45.394 201 53.1941 208.55 59.9941 208.55C66.7941 208.55 74.5941 201 79.8441 195.9C94.1441 182.1 108.944 160.3 103.094 134.5ZM76.3941 138.65L56.3941 158.65C55.6441 159.4 54.6941 159.75 53.7441 159.75C52.7941 159.75 51.8441 159.4 51.0941 158.65L43.594 151.15C42.144 149.7 42.144 147.3 43.594 145.85C45.044 144.4 47.444 144.4 48.894 145.85L53.7441 150.7L71.0941 133.35C72.5441 131.9 74.9441 131.9 76.3941 133.35C77.8441 134.8 77.8441 137.2 76.3941 138.65Z"
        fill="#292D32"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  Container: {
    height: "100%",
    paddingInline: 32,
    flexDirection: "column",
    flex: 1,
    display: "flex",
  },
});
