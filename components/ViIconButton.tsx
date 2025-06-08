import { Icon } from "phosphor-react-native";
import { Text, TouchableNativeFeedback, View } from "react-native";

interface IconButtonProps {
  Icon: Icon;
  onPress: () => void;
  children: any;
}
export const ViIconButton = ({ Icon, onPress, children }: IconButtonProps) => {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Icon />
          <Text>{children}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
