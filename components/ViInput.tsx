import {
  Button,
  Pressable,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  ViewStyle,
  View,
  TextInput,
} from "react-native";

const buttonVariants = ["primary", "secondary", "danger"] as const;
type ButtonVariant = (typeof buttonVariants)[number];
const buttonTypes = ["light", "outline", "text-only"] as const;
type ButtonTypes = (typeof buttonTypes)[number];

const globStyles = require("../globalStyles");

interface ViInputProps {
  variant?: ButtonVariant;
  type?: ButtonTypes;
  label: string;
  style?: ViewStyle;
}

export function ViInput({
  variant = "primary",
  type = "light",
  label,
  style,
}: ViInputProps) {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <View style={[styles.inputBase, outlineStyles[variant], style]}>
        <TextInput
          style={{
            borderColor: "green",
            width: "100%",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 2,
  },
  inputBase: {
    paddingBlock: 16,
    paddingInline: 16,
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

const outlineStyles = StyleSheet.create({
  primary: { borderColor: "#428a5e" },
  secondary: { borderColor: "#215dab" },
  danger: { borderColor: "#82181a" },
});
