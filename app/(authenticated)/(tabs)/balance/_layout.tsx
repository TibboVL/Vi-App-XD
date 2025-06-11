import { router, Stack } from "expo-router";
import "react-native-reanimated";
import { BackgroundColors, headerStyles } from "../../../../globalStyles";
import { View } from "react-native";
import { lightStyles, ViButton } from "@/components/ViButton";
import { adjustLightness } from "@/constants/Colors";
import { useRouteInfo } from "expo-router/build/hooks";
import { createContext, useEffect, useState } from "react";
import { ViSelect } from "@/components/ViSelect";
import { SafeAreaView } from "react-native-safe-area-context";

type TimespanOption = "week" | "month" | "year";
const timespanOptions: { label: string; value: TimespanOption }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
type StatisticVariantOptions = "overview" | "mood" | "energy";
const statisticVariantOptions: {
  label: string;
  value: StatisticVariantOptions;
}[] = [
  { label: "Overview", value: "overview" },
  { label: "Mood", value: "mood" },
  { label: "Energy", value: "energy" },
];

interface BalanceContextProps {
  dateRange: { start: Date; end: Date } | undefined;
  selectedTimespan: TimespanOption;
  selectedStatisticVariant: StatisticVariantOptions;
}
export const BalanceContext = createContext<BalanceContextProps | undefined>(
  undefined
);

export default function BalanceStackLayout() {
  const activeRoute = useRouteInfo();
  const [selectedTimespan, setSelectedTimespan] =
    useState<TimespanOption>("week");
  const [selectedStatisticVariant, setSelectedStatisticVariant] =
    useState<StatisticVariantOptions>("overview");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>();

  useEffect(() => {
    if (selectedTimespan) {
      const now = new Date();

      let start: Date;
      let end: Date;

      switch (selectedTimespan) {
        case "week":
          // Start = Monday of current week
          start = new Date(now);
          const day = start.getDay(); // 0 (Sun) to 6 (Sat)
          const diffToMonday = (day + 6) % 7; // Shift Sunday (0) to last
          start.setDate(start.getDate() - diffToMonday);
          start.setHours(0, 0, 0, 0);

          end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;

        case "month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
          end.setHours(23, 59, 59, 999);
          break;

        case "year":
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          end.setHours(23, 59, 59, 999);
          break;

        default:
          console.error("Something went wrong when changing timespan");
          return;
      }

      setDateRange({ start, end });
    }
  }, [selectedTimespan]);

  return (
    <BalanceContext.Provider
      value={{
        dateRange: dateRange,
        selectedTimespan: selectedTimespan,
        selectedStatisticVariant: selectedStatisticVariant,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            paddingTop: 8,
            paddingInline: 16,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <ViSelect
              variant="secondary"
              selectedValue={selectedTimespan}
              onValueChange={(itemValue) => setSelectedTimespan(itemValue)}
              options={timespanOptions}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <ViSelect
              variant="secondary"
              selectedValue={selectedStatisticVariant}
              onValueChange={(itemValue) =>
                setSelectedStatisticVariant(itemValue)
              }
              options={statisticVariantOptions}
            />
          </View>
        </View>

        <Stack screenOptions={headerStyles}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="perActivity" options={{ headerShown: false }} />
        </Stack>

        <View
          style={{
            flexDirection: "row",
            padding: 6,
            margin: 8,
            borderRadius: 24,
            gap: 8,
            backgroundColor: adjustLightness(
              BackgroundColors.primary.backgroundColor,
              15
            ),
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <ViButton
              onPress={() => router.navigate("/balance")}
              title="Timeline"
              outerStyle={{
                borderRadius: 24,
                minHeight: 0,
              }}
              innerStyle={{
                paddingBlock: 12,

                backgroundColor:
                  activeRoute.pathname == "/balance"
                    ? lightStyles.primary.backgroundColor
                    : "transparent",
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <ViButton
              onPress={() =>
                router.navigate({
                  pathname: "/balance/perActivity",
                  params: {
                    showTabBar: 1,
                  },
                })
              }
              title="Activity impact"
              outerStyle={{
                minHeight: 0,

                borderRadius: 24,
              }}
              innerStyle={{
                paddingBlock: 12,

                backgroundColor:
                  activeRoute.pathname == "/balance/perActivity"
                    ? lightStyles.primary.backgroundColor
                    : "transparent",
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </BalanceContext.Provider>
  );
}
