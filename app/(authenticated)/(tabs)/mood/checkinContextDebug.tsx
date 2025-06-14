import { Text, View } from "react-native";
import { useCheckinState } from "./checkinContext";

export default function ContextDebugView() {
  const state = useCheckinState();

  return (
    <View
      style={{
        backgroundColor: "rgba(255,0,0,0.4)",
        position: "absolute",
        zIndex: 1000,
        //display: "none",
      }}
    >
      <Text>DEBUG</Text>
      <Text>userActivityId:{state.userActivityId ?? "null"}</Text>
      <Text>
        Activity:{JSON.stringify(state.compactUserActivityListItem) ?? "null"}
      </Text>
      <Text>Mood1:{state.moodBefore ?? "null"}</Text>
      <Text>Mood2:{state.moodAfter ?? "null"}</Text>
      <Text>Energy1:{state.energyBefore ?? "null"}</Text>
      <Text>Energy2:{state.energyAfter ?? "null"}</Text>
      <Text>
        isOnboarding:
        {state.isOnboarding
          ? "true"
          : state.isOnboarding == false
          ? "false"
          : "null"}
      </Text>
    </View>
  );
}
