import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ToastAndroid
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const globStyles = require("../../../globalStyles");

export default function DiscoverScreen() {
  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <View style={{ flexDirection: "column", width: "100%", height:"90%", gap: 8 }}>
        <Text style={globStyles.h3}>Suggestions for you</Text>
        <ViActivitySuggestion
          title="Go on a hike with the CMU Hiking Club"
          tags={["Sports", "Mindfullness"]}
          energylevel="High"
          duration="30m"
          cost="20"
          distance="5 km"
          shareable={true}
          activityType="hiking"
          onPress={() => {
            ToastAndroid.show("Go Hiking", ToastAndroid.SHORT);
          }}
          />
        <ViActivitySuggestion
         title = "Swimming event at the local pool"
         tags = {["Sports", "Connections"]}
         energylevel = "Medium"
         duration = "60m"
         cost = "10"
         distance = "<1 km"
         shareable = {true}
          activityType="swimming"
         onPress = {() => {
           ToastAndroid.show("Go Swimming", ToastAndroid.SHORT);
          }}
          />
        <ViActivitySuggestion
         title = "Join the CMU Coding Club"
         tags = {["Skills", "Connections"]}
         energylevel = "Low"
         duration = "90m"
         cost = "Free"
         distance = "<1 km"
         shareable = {true}
          activityType="coding"
         onPress = {() => {
           ToastAndroid.show("Join Coding Club", ToastAndroid.SHORT);
          }}
          />
          </View>
        <ViButton
          title="Explore More Activities"
          variant="primary"
          type="light"
          onPress={() => {
            ToastAndroid.show("Explore More Activities", ToastAndroid.SHORT);
          }}
          />
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
});
