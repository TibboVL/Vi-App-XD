import { EnergyLevel, EnergyMappings } from "@/types/activity";

export function mapEnergyToFriendly(curEnergyLevel: number | undefined) {
  return curEnergyLevel
    ? Object.entries(EnergyLevel)
        .find(
          (energyLevel) =>
            energyLevel[0] ==
            Object.entries(EnergyMappings).find(([key, value]) => {
              if (curEnergyLevel >= value.min && curEnergyLevel <= value.max) {
                return key;
              }
              return;
            })?.[0]
        )?.[1]
        .toLowerCase()
    : null;
}
