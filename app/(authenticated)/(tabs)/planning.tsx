import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
} from "@/globalStyles";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionBase,
  DefaultSectionT,
  TouchableNativeFeedback,
  ToastAndroid,
} from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  Timeline,
} from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";
import {
  CompactUserActivityListDayContainer,
  CompactUserActivityListItem,
} from "@/types/userActivityList";
import { ViButton } from "@/components/ViButton";
import { CaretLeft, CaretRight } from "phosphor-react-native";
import { Tag } from "@/components/ViCategoryTag";
import { PillarKey } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";

export default function PlanningScreen() {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const { getCredentials } = useAuth0();

  const today = new Date().toISOString().split("T")[0];
  const [activeDate, setActiveDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [userActivityListContainers, setUserActivityListContainers] = useState<
    CompactUserActivityListDayContainer[]
  >([]);

  // TODO, make this get only like a month or 2-3 worth of data and fetch more depending on date change or so
  async function fetchUserActivityListItems() {
    setLoading(true);
    const creds = await getCredentials();
    if (!creds) return;
    console.log(creds.accessToken);
    const query = `${API_URL}/useractivitylist/`;
    console.log(query);
    const response = await fetch(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creds.accessToken}`,
      },
    });

    const data = (await response.json())
      .data as CompactUserActivityListDayContainer[];

    setUserActivityListContainers(data);
    setLoading(false);
  }
  useEffect(() => {
    fetchUserActivityListItems();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#fff",
      }}
    >
      <SafeAreaView>
        <View style={[styles.Container]}>
          <View
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
            }}
          >
            <CalendarProvider
              date={activeDate}
              style={[
                BackgroundColors.background,
                {
                  flex: 1,
                  height: "100%",
                  width: "100%",
                },
              ]}
              onDateChanged={(newDate) => setActiveDate(newDate)}
            >
              <ExpandableCalendar
                style={{
                  zIndex: 10,
                }}
                firstDay={1}
                allowShadow={false}
                hideArrows={true}
                renderHeader={(dateString) =>
                  CalendarHeader({ dateString, setActiveDate })
                }
              />
              <View
                style={{
                  height: 0,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    top: -10,
                    left: 0,
                    right: 0,
                    width: "100%",
                    height: 12,
                    backgroundColor: "#fff",
                    zIndex: 5,

                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  pointerEvents="none" // make sure it doesn't block touches
                />
              </View>
              {!loading ? (
                userActivityListContainers.length < 1 ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text>You don't have any plans this week</Text>
                  </View>
                ) : (
                  <AgendaList
                    renderSectionHeader={SectionHeader}
                    sections={userActivityListContainers}
                    renderItem={AgendaItem}
                    style={{ flex: 1, height: "100%", width: "100%" }}
                  />
                )
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Viloader vitoMessage="Vito is stitching together your schedule!" />
                </View>
              )}
            </CalendarProvider>
          </View>
          {/*  <ViButton
            title="Force refresh (debug)"
            onPress={() => {
              setUserActivityListContainers([]);
              fetchUserActivityListItems();
            }}
          /> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

interface CalendarProps {
  dateString: string;
  setActiveDate: (newDate: string) => void;
}
const CalendarHeader = ({ dateString, setActiveDate }: CalendarProps) => {
  const date = new Date(dateString);
  var options = {
    month: "long",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;

  const goToPreviousMonth = () => {
    const prevMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setActiveDate(prevMonth.toISOString().split("T")[0]);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setActiveDate(nextMonth.toISOString().split("T")[0]);
  };
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        paddingBlock: 12,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <HeaderButton direction="left" onPress={goToPreviousMonth} />
      <Text>{date.toLocaleDateString("en-us", options)}</Text>
      <HeaderButton direction="right" onPress={goToNextMonth} />
    </View>
  );
};
interface HeaderButtonProps {
  direction: "left" | "right";
  onPress: () => void;
}
const HeaderButton = ({ direction, onPress }: HeaderButtonProps) => {
  return (
    <View
      style={{
        minHeight: 0,
        height: 0,
        justifyContent: "center",
      }}
    >
      <TouchableNativeFeedback onPress={onPress}>
        {direction == "left" ? (
          <CaretLeft size={24} />
        ) : (
          <CaretRight size={24} />
        )}
      </TouchableNativeFeedback>
    </View>
  );
};

const SectionHeader = (date: any) => {
  const today = new Date().toISOString().split("T")[0] == date;
  var optionsDay = {
    day: "numeric",
  } as Intl.DateTimeFormatOptions;
  var optionsWeekday = {
    weekday: "long",
  } as Intl.DateTimeFormatOptions;
  var optionsMonth = {
    month: "long",
  } as Intl.DateTimeFormatOptions;
  const day = new Date(date).toLocaleDateString("en-nl", optionsDay);
  const weekday = new Date(date).toLocaleDateString("en-nl", optionsWeekday);
  const month = new Date(date).toLocaleDateString("en-nl", optionsMonth);
  return (
    <View
      style={[
        BackgroundColors.background,
        { paddingInline: 16, paddingBlock: 8 },
      ]}
    >
      <Text style={textStyles.bodySmall}>
        {today ? "Today, " : null}
        {weekday} {day} {month}
      </Text>
    </View>
  );
};

interface ItemProps {
  item: CompactUserActivityListItem; // TODO improve typesafety
}
const AgendaItem = (props: ItemProps) => {
  const { item } = props;
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  const start = new Date(item.plannedStart!).toLocaleTimeString(
    "en-nl",
    options
  );
  const end = new Date(item.plannedEnd!).toLocaleTimeString("en-nl", options);

  const itemPressed = useCallback(() => {
    ToastAndroid.show(`Not implemented`, ToastAndroid.SHORT);
  }, [item]);

  return (
    <View style={styles.wrapper}>
      <TouchableNativeFeedback onPress={itemPressed}>
        <View
          style={[
            styles.card,
            {
              padding: 10,
              paddingInline: 12,
            },
          ]}
        >
          <View>
            <Text style={{ fontWeight: 700 }}>{item.activityTitle}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>
                {start} - {end}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                {item.categories.map((category) => (
                  <Tag
                    key={category.name}
                    label={category.name}
                    pillar={category.pillar?.toLowerCase() as PillarKey}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
    height: "100%",
  },
  wrapper: {
    marginBlock: 4,
    marginInline: 16,
    flex: 1, // shrink if needed
    //width: "100%", // expand as much as possible
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
  },
});
