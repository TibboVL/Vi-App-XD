import { adjustLightness } from "@/constants/Colors";
import { BackgroundColors } from "@/globalStyles";
import { CompactUserActivityListItem } from "@/types/userActivityList";
import { Check } from "phosphor-react-native";
import { Text, TouchableNativeFeedback, View } from "react-native";
import ViCategoryContainer from "./ViCategoryContainer";
import { Activity } from "@/types/activity";

interface ItemProps {
  item: CompactUserActivityListItem;
  includeDate?: boolean;
  selected?: boolean;
  onPress: () => void;
}
export const AgendaItem = ({
  item,
  includeDate = false,
  selected = false,
  onPress,
}: ItemProps) => {
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  var dateOptions = {
    day: "numeric",
    // weekday: "long",
    month: "short",
  } as Intl.DateTimeFormatOptions;
  let date = null;
  if (includeDate) {
    date = new Date(item.plannedStart!).toLocaleDateString(
      "en-be",
      dateOptions
    );
  }
  const start = new Date(item.plannedStart!).toLocaleTimeString(
    "en-nl",
    options
  );
  const end = new Date(item.plannedEnd!).toLocaleTimeString("en-nl", options);

  const borderColor = selected
    ? BackgroundColors.primary.backgroundColor
    : "#fff";
  return (
    <View
      style={{
        marginBlock: 4,
        marginInline: 16,
        overflow: "hidden",
        borderWidth: 2,
        borderRadius: 18,
        borderColor: borderColor,
      }}
    >
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            paddingInline: 12,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: 700 }}>{item.activityTitle}</Text>
              {item.markedCompletedAt != null ? (
                <Check
                  size={16}
                  style={{
                    transform: [
                      {
                        translateX: -3,
                      },
                      { translateY: -2 },
                    ],
                  }}
                  weight="bold"
                  color={adjustLightness(
                    BackgroundColors.primary.backgroundColor,
                    -20
                  )}
                />
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>
                {date ? date + " at" : ""} {start} {date ? "" : end}
              </Text>
              <ViCategoryContainer
                activity={
                  {
                    categories: item.categories,
                  } as Activity
                }
              />
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
