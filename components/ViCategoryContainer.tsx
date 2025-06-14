import { Activity, ActivityDetails, PillarKey } from "@/types/activity";
import { Text, View, ViewStyle } from "react-native";
import { Tag } from "./ViCategoryTag";

interface ViCategoryContainerProps {
  activity: Activity | ActivityDetails | undefined;
  style?: ViewStyle;
}

export default function ViCategoryContainer({
  activity,
  style,
}: ViCategoryContainerProps) {
  return activity && activity.categories?.length > 0 ? (
    <View
      style={{
        marginTop: 4,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        ...style,
      }}
    >
      {activity?.categories?.map((category, index) => (
        <Tag
          key={index}
          label={category.name}
          pillar={category.pillar?.toLowerCase() as PillarKey}
        />
      ))}
    </View>
  ) : (
    <Text>No categories - this shouldnt happen!</Text>
  );
}
