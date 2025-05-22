import { TextColors } from "@/globalStyles";
import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { BackgroundColors } from "../globalStyles";

interface SliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  step: number;
  onChange: (val: number) => void;
}
export function ViSlider({
  minValue = 0,
  maxValue = 100,
  value,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text>{minValue}</Text>
      <Slider
        step={step}
        style={{ width: "100%", height: 40, flex: 1 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        value={value}
        onSlidingComplete={(newVal) => onChange(newVal)}
        minimumTrackTintColor={TextColors.primary.color}
        maximumTrackTintColor="#000000"
        thumbTintColor={BackgroundColors.primary.backgroundColor}
      />
      <Text>{maxValue}</Text>
    </View>
  );
}
