import { EnergyLevel } from "@/types/activity";
import {
  BatteryFull,
  BatteryHigh,
  BatteryLow,
  BatteryMedium,
} from "phosphor-react-native";
import { useMemo } from "react";

interface EnergyLeveLIconProps {
  energy: string;
  size: number;
  style?: any;
}

export function EnergyIcon({ energy, size = 20, style }: EnergyLeveLIconProps) {
  return useMemo(() => {
    switch (energy.toLowerCase()) {
      case EnergyLevel.Low.toLowerCase():
        return <BatteryLow {...style} size={size} />;
      case EnergyLevel.Medium.toLowerCase():
        return <BatteryMedium {...style} size={size} />;
      case EnergyLevel.High.toLowerCase():
        return <BatteryHigh {...style} size={size} />;
      case EnergyLevel.VeryHigh.toLowerCase():
        return <BatteryFull {...style} size={size} />;
      default:
        return <BatteryLow {...style} size={size} />;
    }
  }, [energy]);
}
