import { View, ViewStyle } from "react-native";
import { lightStyles } from "./ViButton";

interface ViButtonProps {
  style?: ViewStyle;
}

export function ViDivider({ style }: ViButtonProps) {
  return (
    <View
      style={[
        lightStyles.primary,
        {
          height: 2,
          marginBlock: 12,
        },
      ]}
    ></View>
  );
}
