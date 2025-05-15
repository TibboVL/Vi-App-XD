import {
  Button,
  Pressable,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  ViewStyle,
  View,
} from "react-native";

const buttonVariants = ["primary", "secondary", "danger"] as const;
type ButtonVariant = (typeof buttonVariants)[number];
const buttonTypes = ["light", "outline", "text-only"] as const;
type ButtonTypes = (typeof buttonTypes)[number];

const globStyles = require("../globalStyles");

interface ViButtonProps {
  variant?: ButtonVariant;
  type?: ButtonTypes;
  enabled?: boolean;
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ViButton({
  variant = "primary",
  type = "light",
  enabled = true,
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
            type == "light"
              ? lightStyles[variant]
              : type == "outline"
              ? outlineStyles[variant]
              : "",
            style,
          ]}
        >
          <Text
            style={[
              {
                textTransform: "capitalize",
              },
              globStyles.CTA,
              variant === "primary"
                ? styles.textPrimary
                : variant === "secondary"
                ? styles.textSecondary
                : styles.textDanger,
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
    flex: 1, // shrink if needed
    maxHeight: 56, // ensure  we dont grow vertically!
    width: "100%", // expand as much as possible
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonBase: {
    paddingBlock: 16,
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
