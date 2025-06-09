import { BackgroundColors, textStyles } from "@/globalStyles";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompactUserActivityListItem } from "@/types/userActivityList";
import {
  ArrowLeft,
  Calendar,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  Trash,
} from "phosphor-react-native";
import { Tag } from "@/components/ViCategoryTag";
import { getPillarInfo, PillarKey } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import { adjustLightness } from "@/constants/Colors";
import {
  useDeleteActivityList,
  useGetUserActivityList,
  useUpdateUserActivityList,
} from "@/hooks/useUserActivityList";
import VitoError from "@/components/ViErrorHandler";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ViButton } from "@/components/ViButton";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ViIconButton } from "@/components/ViIconButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useGetActivityDetails } from "@/hooks/useActivityDetails";
import { ActivityDetailInformation } from "./discover/[activityId]";
import {
  CheckinContextAction,
  useCheckinDispatch,
} from "./mood/checkinContext";
import { isEmpty } from "lodash";
import { MarkedDates } from "react-native-calendars/src/types";

export default function PlanningScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [activeDate, setActiveDate] = useState(today);
  const [selectedActivityListItem, setSelectedActivityListItem] =
    useState<CompactUserActivityListItem | null>(null);
  const bottomModalSheetRef = useRef<BottomSheetModal>(null);
  const handleOpenSheet = () => bottomModalSheetRef.current!.present();
  const handleCloseSheet = () => bottomModalSheetRef.current!.close();

  const {
    isLoading,
    data: userActivityListContainers,
    error,
    refetch,
  } = useGetUserActivityList();

  const handleAgendaItemPress = (item: CompactUserActivityListItem) => {
    setSelectedActivityListItem(item);
    handleOpenSheet();
  };

  const getMarkedDates = useMemo(() => {
    const marked: MarkedDates = {};

    userActivityListContainers?.forEach((item) => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
        const dots = [];
        for (const entry of item.data) {
          dots.push({
            key: entry.userActivityId.toString(),
            color: adjustLightness(
              getPillarInfo(
                entry.categories[0].pillar.toLowerCase() as PillarKey
              )?.color,
              -10
            ),
          });
        }
        marked[item.title!] = {
          marked: true,
          dots: dots,
          selectedColor: adjustLightness(
            BackgroundColors.background.backgroundColor,
            -15
          ),

          //selectedTextColor:
        };
      } else {
        marked[item.title!] = {
          disabled: true,
        };
      }
    });
    console.log(JSON.stringify(marked));
    return marked;
  }, [userActivityListContainers]);

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
                dayComponent={({ date, state, marking, theme, onPress }) => {
                  const isToday = date!.dateString === today;
                  return (
                    <View
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => (onPress ? onPress(date) : null)}
                      >
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderWidth: 2,
                            borderRadius: 8,
                            borderColor:
                              state == "selected"
                                ? BackgroundColors.primary.backgroundColor
                                : isToday
                                ? "#ccc"
                                : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color:
                                state == "selected"
                                  ? adjustLightness(
                                      BackgroundColors.primary.backgroundColor,
                                      -20
                                    ) //"#fff"
                                  : isToday
                                  ? "#555" // adjustLightness(  BackgroundColors.primary.backgroundColor,   30     )
                                  : date?.month ==
                                    parseInt(activeDate.split("-")[1])
                                  ? "#555"
                                  : "#ccc",
                            }}
                          >
                            {date!.day}
                          </Text>
                          {marking?.dots ? (
                            <View
                              style={{
                                marginTop: 2,
                                height: 4,
                                width: 32,
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: 2,
                              }}
                            >
                              {marking?.dots?.map((dot) => {
                                // console.log(dot);
                                return (
                                  <View
                                    key={dot.key}
                                    style={{
                                      bottom: 2,
                                      width: 4,
                                      height: 4,
                                      borderRadius: 2,
                                      backgroundColor: dot.color,
                                    }}
                                  />
                                );
                              })}
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                markingType="multi-dot"
                style={{
                  zIndex: 10,
                }}
                markedDates={getMarkedDates}
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
                <Viloader message="Vito is stitching together your schedule!" />
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

              <BottomSheetModal
                backdropComponent={(props) => (
                  <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    pressBehavior="close"
                  />
                )}
                ref={bottomModalSheetRef}
                backgroundStyle={[
                  BackgroundColors.background,
                  {
                    boxShadow: "-10px -10px 10px rgba(0,0,0,0.1)",
                  },
                ]}
                enableContentPanningGesture={false} // Prevents modal drag from content
              >
                <EditExistingEventSheet
                  handleClose={handleCloseSheet}
                  compactUserActivityListItem={selectedActivityListItem}
                />
              </BottomSheetModal>
            </CalendarProvider>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

interface ExitingEventSheetProps {
  handleClose: () => void;
  compactUserActivityListItem: CompactUserActivityListItem | null;
}
function EditExistingEventSheet({
  handleClose,
  compactUserActivityListItem,
}: ExitingEventSheetProps) {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [startDatePickerMode, setStartDatePickerMode] = useState<
    "datetime" | "date" | "time" | undefined
  >("date");
  const [endDatePickerMode, setEndDatePickerMode] = useState<
    "datetime" | "date" | "time" | undefined
  >("date");
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDateTime, setStartDateTime] = useState(
    new Date(compactUserActivityListItem?.plannedStart ?? 0)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date(compactUserActivityListItem?.plannedEnd ?? 0)
  );
  const router = useRouter();

  const handleConfirmStartDate = (date: any) => {
    console.warn("A date has been picked: ", date);
    if (date > endDateTime) {
      setEndDateTime(date);
    }
    setStartDatePickerVisibility(false);
    setStartDateTime(date);
  };
  const handleConfirmEndDate = (date: any) => {
    console.warn("A date has been picked: ", date);
    setEndDatePickerVisibility(false);
    setEndDateTime(date);
  };

  useEffect(() => {
    handleUpdateEvent();
  }, [startDateTime, endDateTime]);

  const {
    isLoading,
    data: activity,
    error,
    refetch,
  } = useGetActivityDetails({
    activityId: compactUserActivityListItem?.activityId!,
  });
  useEffect(() => {
    console.log(activity);
  }, [activity]);
  const queryClient = useQueryClient();
  const {
    mutate: handleUpdate,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateUserActivityList();
  async function handleUpdateEvent() {
    handleUpdate(
      {
        userActivityId: compactUserActivityListItem?.userActivityId!,
        plannedStart: startDateTime,
        plannedEnd: endDateTime,
      },
      {
        onSuccess: (data) => {
          // handleClose();
          queryClient.invalidateQueries({ queryKey: ["user-activity-list"] });
        },
      }
    );
  }

  const {
    mutate: handleDelete,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteActivityList();
  async function handleDeleteEvent() {
    handleDelete(
      {
        userActivityId: compactUserActivityListItem?.userActivityId!,
      },
      {
        onSuccess: (data) => {
          handleClose();
          queryClient.invalidateQueries({ queryKey: ["user-activity-list"] });
        },
      }
    );
  }
  const dispatch = useCheckinDispatch();
  const handleStartReview = () => {
    handleClose();
    if (router.canDismiss()) router.dismissAll();
    dispatch({
      action: CheckinContextAction.SET_USER_ACTIVITY, // automatically resets the rest
      payload: compactUserActivityListItem?.userActivityId,
    });
    router.push("/mood/moodPicker");
  };

  var dateOptions = {
    day: "numeric",
    weekday: "long",
    month: "short",
  } as Intl.DateTimeFormatOptions;
  var timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;

  return (
    <BottomSheetView>
      {updateError ? (
        <VitoError
          error={updateError}
          loading={isUpdating}
          refetch={handleUpdateEvent}
        />
      ) : null}
      {deleteError ? (
        <VitoError
          error={deleteError}
          loading={isDeleting}
          refetch={handleDeleteEvent}
        />
      ) : null}
      {isDeleting || isUpdating || isLoading ? (
        <Viloader inPopup={true} message="Vito is working on it!" />
      ) : (
        <View
          style={{
            padding: 16,
            paddingBottom: 32,
            gap: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {activity?.name}
            </Text>
            {compactUserActivityListItem?.markedCompletedAt != null ? (
              <Check
                size={24}
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
              gap: 4,
              marginTop: 8,
            }}
          >
            {activity?.categories.map((category) => (
              <Tag
                key={category.name}
                label={category.name}
                pillar={category.pillar?.toLowerCase() as PillarKey}
              />
            ))}
          </View>
          <Text
            style={{
              paddingTop: 8,
            }}
          >
            Start
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <ViIconButton
              Icon={Calendar}
              onPress={() => {
                setStartDatePickerMode("date");
                setStartDatePickerVisibility(true);
              }}
            >
              {startDateTime.toLocaleDateString("en-us", dateOptions)}
            </ViIconButton>
            <ViIconButton
              Icon={Clock}
              onPress={() => {
                setStartDatePickerMode("time");
                setStartDatePickerVisibility(true);
              }}
            >
              {startDateTime.toLocaleTimeString("nl-be", timeOptions)}
            </ViIconButton>
          </View>
          <Text
            style={{
              paddingTop: 8,
            }}
          >
            End
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <ViIconButton
              Icon={Calendar}
              onPress={() => {
                setEndDatePickerMode("date");
                setEndDatePickerVisibility(true);
              }}
            >
              {endDateTime.toLocaleDateString("en-us", dateOptions)}
            </ViIconButton>
            <ViIconButton
              Icon={Clock}
              onPress={() => {
                setEndDatePickerMode("time");
                setEndDatePickerVisibility(true);
              }}
            >
              {endDateTime.toLocaleTimeString("nl-be", timeOptions)}
            </ViIconButton>
          </View>
          <ScrollView>
            <ActivityDetailInformation
              activity={activity!}
              customStyles={{
                Container: {
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingTop: 12,
                },
              }}
              showHeader={false}
            />
          </ScrollView>
          <DateTimePickerModal
            date={startDateTime}
            locale="en_GB"
            is24Hour={true}
            firstDayOfWeek={1}
            mode={startDatePickerMode}
            isVisible={isStartDatePickerVisible}
            onConfirm={handleConfirmStartDate}
            onCancel={() => setStartDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            date={endDateTime}
            locale="en_GB"
            is24Hour={true}
            firstDayOfWeek={1}
            mode={endDatePickerMode}
            isVisible={isEndDatePickerVisible}
            onConfirm={handleConfirmEndDate}
            onCancel={() => setEndDatePickerVisibility(false)}
          />
        </View>
      )}
      <View style={[styles.BottomContainer]}>
        <ViButton
          title="Close"
          variant="primary"
          //type="text-only"
          Icon={ArrowLeft}
          hideText={true}
          enabled={isUpdating || isDeleting ? false : true}
          onPress={() => handleClose()}
        />
        <View style={styles.BottomContainerButton}>
          <ViButton
            title={
              compactUserActivityListItem
                ? compactUserActivityListItem.markedCompletedAt == null
                  ? "Review"
                  : "Already reviewed!"
                : "Review"
            }
            variant="primary"
            type="light"
            enabled={
              isUpdating ||
              isDeleting ||
              compactUserActivityListItem?.markedCompletedAt != null
                ? false
                : true
            }
            onPress={() => handleStartReview()}
          />
        </View>
        <ViButton
          Icon={Trash}
          title="Delete"
          variant="danger"
          type="light"
          hideText={true}
          enabled={isUpdating || isDeleting ? false : true}
          onPress={() => handleDeleteEvent()}
        />
      </View>
    </BottomSheetView>
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
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
  BottomContainerButton: { flex: 1 },
});
