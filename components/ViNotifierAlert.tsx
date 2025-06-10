import { StyleSheet, Text } from "react-native";
import { NotifierComponents, NotifierProps } from "react-native-notifier";
import { AlertComponentProps } from "react-native-notifier/lib/typescript/src/components/Alert";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: { color: "white", fontWeight: "bold" },
  description: { color: "white" },
});
const bgColors: Record<any, string> = {
  error: "#E03737",
  warn: "#FFAC00",
  info: "#007BFF",
  success: "#00B104",
};

export const ViNotifierAlert = (props: AlertComponentProps) => (
  <SafeAreaView
    style={{
      backgroundColor: props.backgroundColor || bgColors[props.alertType],
    }}
  >
    <NotifierComponents.Alert {...props} />
  </SafeAreaView>
);
