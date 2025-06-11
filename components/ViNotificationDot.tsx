import { textStyles } from "@/globalStyles";
import { Text, TextStyle } from "react-native";

interface ViNotificationDotProps {
  styles?: TextStyle;
  content: string | number;
}
export default function ViNotificationDot({
  styles,
  content,
}: ViNotificationDotProps) {
  return (
    <Text
      style={[
        textStyles.bodySmall,
        {
          zIndex: 10,
          height: 16,
          aspectRatio: 1,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 1000,
          ...styles,
        },
      ]}
    >
      {content}
    </Text>
  );
}
