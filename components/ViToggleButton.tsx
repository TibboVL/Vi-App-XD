import { textStyles } from "@/globalStyles";
import {
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  ViewStyle,
  View,
} from "react-native";

interface ViButtonProps {
  enabled?: boolean;
  state: boolean;
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ViToggleButton({
  enabled = true,
  state = false,
  title,
  onPress,
  style,
}: ViButtonProps) {
  return (
    <View style={styles.container}>
      {!enabled ? (
        <View
          style={{
            zIndex: 10,
            backgroundColor: "#ffffff66",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        ></View>
      ) : null}
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={[
            styles.buttonBase,
            state ? lightStyles.primary : outlineStyles.primary,
            style,
          ]}
        >
          <Text
            style={[
              {
                textTransform: "capitalize",
              },
              textStyles.CTA,

              styles.textPrimary,
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // maxHeight: 56 - 8, // ensure  we dont grow vertically!
    // minHeight: 56 - 8,
    width: "100%", // expand as much as possible
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonBase: {
    paddingBlock: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00000000",
  },

  textPrimary: {
    color: "#21452f",
  },
  textSecondary: {
    color: "#040c15",
  },
  textDanger: {
    color: "#82181a",
  },
});

export const lightStyles = StyleSheet.create({
  primary: { backgroundColor: "#98cdac" },
  secondary: { backgroundColor: "#7eace7" },
  danger: { backgroundColor: "#ffa2a2" },
});

const outlineStyles = StyleSheet.create({
  primary: { borderColor: "#428a5e" },
  secondary: { borderColor: "#215dab" },
  danger: { borderColor: "#82181a" },
});
