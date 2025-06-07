import { BackgroundColors, textStyles } from "@/globalStyles";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  ToastAndroid,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompactUserActivityListItem } from "@/types/userActivityList";
import { CaretLeft, CaretRight, Scroll } from "phosphor-react-native";
import { Tag } from "@/components/ViCategoryTag";
import { PillarKey } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import { adjustLightness } from "@/constants/Colors";
import { useGetUserActivityList } from "@/hooks/useUserActivityList";
import { useDeleteActivityFromUserActivityList } from "@/hooks/useUserActivityList";
import VitoError from "@/components/ViErrorHandler";
import { RefreshControl } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { set } from "lodash";
import { ViButton } from "@/components/ViButton";
import { X } from "phosphor-react-native";


export default function PlanningScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [activeDate, setActiveDate] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CompactUserActivityListItem | null>(null);
  const router = useRouter();

  const {
    isLoading,
    data: userActivityListContainers,
    error,
    refetch,
  } = useGetUserActivityList();

  const { mutate: deleteActivity} = useDeleteActivityFromUserActivityList();

  const handleAgendaItemPress = (item: CompactUserActivityListItem) => {
    setSelectedActivity(item);
    setModalVisible(true);
  };

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
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Viloader vitoMessage="Vito is stitching together your schedule!" />
                </View>
              ) : null}
              {error ? (
                <VitoError
                  error={error}
                  loading={isLoading}
                  refetch={refetch}
                />
              ) : null}
              {userActivityListContainers ? (
                <AgendaList
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        height: 500,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text>You don't have any plans yet!</Text>
                    </View>
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={isLoading}
                      onRefresh={refetch}
                    />
                  }
                  renderSectionHeader={SectionHeader}
                  sections={userActivityListContainers}
                  renderItem={({ item }) => (
                    <AgendaItem
                      item={item}
                      onPress={() => handleAgendaItemPress(item)}
                    />
                  )}
                  style={{ flex: 1, height: "100%", width: "100%" }}
                />
              ) : null}
              <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    minWidth: "80%",
                    maxWidth: "90%",
                    maxHeight: "40%",
                    alignSelf: "center",
                    position: "absolute",
                    top: "30%",
                    left: "5%",
                    right: "5%",
                    bottom: "30%",
                  }}>
                  <ScrollView>
                    {selectedActivity && (
                      <>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          {selectedActivity.activityTitle}
                        </Text>
                        <Text>
                          {new Date(selectedActivity.plannedStart!).toLocaleString()}
                        </Text>
                        <Text>
                          {new Date(selectedActivity.plannedEnd!).toLocaleString()}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 4,
                            marginTop: 8,
                          }}
                        >
                          {selectedActivity.categories.map((category) => (
                            <Tag
                              key={category.name}
                              label={category.name}
                              pillar={category.pillar?.toLowerCase() as PillarKey}
                            />
                          ))}     
                        </View>
                      <ViButton 
                        title="Delete Activity"
                        variant="danger"
                        onPress={() => {
                          if (!selectedActivity) return;
                          deleteActivity({
                            userActivityListId: selectedActivity.userActivityId
                          },
                            {
                              onSuccess: () => {
                                setModalVisible(false);
                                refetch();
                              },
                              onError: (error) => {
                                ToastAndroid.show(
                                  `Failed to delete activity: ${error.message}`,
                                  ToastAndroid.LONG
                                );
                              },
                          }
                        );
                      }}

                      />
                      <View style={{ height: 16 }} />
                      <ViButton
                        title="Add Review"
                        variant="primary"
                        onPress={() => {
                          setModalVisible(false);
                          router.push({
                            pathname: "/mood/activity-review",

                            params: {
                              activityId: selectedActivity.activityId,
                            },
                          });
                        }}
                      />
                      <View style={{ height: 16 }} />
                      <TouchableNativeFeedback onPress={() => setModalVisible(false)}>
                        <View
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            padding: 8,
                            borderRadius: 999,
                            backgroundColor: adjustLightness(
                              BackgroundColors.primary.backgroundColor,
                              -20
                            ),
                          }}
                        >
                          <X size={24} color="#fff" />
                        </View>
                      </TouchableNativeFeedback>
                    </>

                    )}
                  </ScrollView>
                </View>
              </Modal>
            </CalendarProvider>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};


  

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
        {
          paddingInline: 16,
          paddingBlock: 8,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        },
      ]}
    >
      <View
        id="TodayIndicator"
        style={{
          display: today ? "flex" : "none",
          height: 12,
          width: 12,
          top: 1,
          borderRadius: 999,
          backgroundColor: adjustLightness(
            BackgroundColors.primary.backgroundColor,
            -20
          ),
        }}
      />
      <Text style={textStyles.bodySmall}>
        {today ? "Today, " : null}
        {weekday} {day} {month}
      </Text>
    </View>
  );
};

interface ItemProps {
  item: CompactUserActivityListItem;
  onPress: () => void; 
}
const AgendaItem = ({ item, onPress }: ItemProps) => {
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  const start = new Date(item.plannedStart!).toLocaleTimeString(
    "en-nl",
    options
  );
  const end = new Date(item.plannedEnd!).toLocaleTimeString("en-nl", options);

  return (
    <View style={styles.wrapper}>
      <TouchableNativeFeedback onPress={onPress}>
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
