import { ViButton } from "@/components/ViButton";
import {
  ExternalPathString,
  Link,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableNativeFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import {
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
  TextColors,
  BackgroundColors,
} from "@/globalStyles";
import { useAuth0 } from "react-native-auth0";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityDetails, PillarKey } from "@/types/activity";
import Constants from "expo-constants";
import { Viloader } from "@/components/ViLoader";
import {
  BabyCarriage,
  Calendar,
  Clock,
  CurrencyEur,
  Envelope,
  Globe,
  Icon,
  MapPinLine,
  Phone,
} from "phosphor-react-native";
import { adjustLightness } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Tag } from "@/components/ViCategoryTag";
import { EnergyIcon } from "@/components/EnergyIcon";
import { useRoute } from "@react-navigation/native";
import { useSearchParams } from "expo-router/build/hooks";

export default function ActivityDetailsScreen({ route }: any) {
  const local = useLocalSearchParams();

  const { getCredentials } = useAuth0();
  const [activity, setActivity] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const [descriptionExpandedState, setDescriptionExpandedState] =
    useState<boolean>(false);

  function toggleDescriptionState() {
    setDescriptionExpandedState(!descriptionExpandedState);
  }

  const bottomModalSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenSheet = () => bottomModalSheetRef.current!.present();
  const handleCloseSheet = () => bottomModalSheetRef.current!.close();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    //console.log("handleSheetChanges", index);
  }, []);
  /*   const { suggestedActivityId } = route.params as {
    suggestedActivityId: number | null;
  };
 */
  const fetchActivityDetails = async () => {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;
      console.log(accessToken);

      const response = await fetch(
        `${API_URL}/activities/${local.activityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.warn("Failed to fetch activity details:", response);
        ToastAndroid.show(
          `Failed to load activity details: ${response.status}`,
          ToastAndroid.SHORT
        );
        return;
      }

      const data = await response.json();
      setActivity(data.data as ActivityDetails);
      //console.log(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity details:", error);
      ToastAndroid.show(
        "Network error while fetching activity details",
        ToastAndroid.SHORT
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    // console.log(local, global);
    fetchActivityDetails();
  }, [local.activityId]);
  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Viloader vitoMessage="Vito is looking gathering more details..." />
        </View>
      ) : activity ? (
        <>
          <ScrollView
            style={[styles.Container]}
            contentContainerStyle={{ gap: 12 }}
          >
            <View
              id="HeaderInfo"
              style={{
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Text style={[textStyles.h4]}>{activity.name}</Text>
              {activity.categories?.length > 0 ? (
                <View style={styles.tagsContainer}>
                  {activity.categories?.map((category) => (
                    <Tag
                      key={category.name}
                      label={category.name}
                      pillar={category.pillar?.toLowerCase() as PillarKey}
                    />
                  ))}
                </View>
              ) : (
                <Text>No categories - this shouldnt happen!</Text>
              )}
            </View>
            <View id="CoreInformation" style={styles.Card}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <CoreInfoBox
                  Icon={CurrencyEur}
                  activity={activity}
                  label="Price"
                  value={
                    activity.estimatedCost
                      ? `€${activity.estimatedCost}`
                      : "Free"
                  }
                />
                <CoreInfoBox
                  Icon={() => (
                    <EnergyIcon
                      style={{ color: TextColors.muted.color }}
                      energy={activity.energyRequired}
                      size={20}
                    />
                  )}
                  activity={activity}
                  label="Required energy"
                  value={activity.energyRequired}
                />
                <CoreInfoBox
                  Icon={BabyCarriage}
                  activity={activity}
                  label="Min age"
                  value={`${activity.minAge ? activity.minAge + " +" : "N/A"}`}
                />
              </View>
              <CoreInfoBox
                Icon={MapPinLine}
                activity={activity}
                label="Location"
                value={`${
                  activity.locationName ? activity.locationName : "N/A"
                }`}
              />
            </View>
            <View
              id="Description"
              style={{
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <TouchableNativeFeedback onPress={() => toggleDescriptionState()}>
                <View style={[styles.Card]}>
                  <Text style={[textStyles.bodyLarge, { fontWeight: "700" }]}>
                    About this event
                  </Text>
                  <Text
                    style={[textStyles.bodyLarge, TextColors.muted]}
                    numberOfLines={!descriptionExpandedState ? 3 : undefined}
                  >
                    {activity.description}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              id="OpeningHours"
              style={[
                styles.Card,
                {
                  display:
                    activity.openingHoursStructured &&
                    activity.openingHoursStructured.length > 0
                      ? "flex"
                      : "none",
                },
              ]}
            >
              <Text style={[textStyles.bodyLarge, { fontWeight: "700" }]}>
                Opening hours
              </Text>
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                {activity.openingHoursStructured?.map((OH, index) => (
                  <View
                    key={OH.weekday}
                    style={{
                      flexDirection: "row",
                      borderBottomColor: adjustLightness(
                        TextColors.muted.color,
                        55
                      ),
                      justifyContent: "space-between",
                      paddingBlock: 4,
                      borderBottomWidth:
                        index == activity.openingHoursStructured!.length - 1
                          ? 0
                          : 1,
                    }}
                  >
                    <Text>
                      {OH.weekday.substring(0, 1).toUpperCase()}
                      {OH.weekday.substring(1, 3)}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 6,
                      }}
                    >
                      {OH.intervals?.map((interval, index) => (
                        <Text key={index}>
                          {interval.opens} - {interval.closes}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View
              id="ContactInfo"
              style={[
                styles.Card,
                {
                  display:
                    activity.contactEmails &&
                    activity.contactPhones &&
                    activity.contactURLs
                      ? "flex"
                      : "none",
                },
              ]}
            >
              <Text style={[textStyles.bodyLarge, { fontWeight: "700" }]}>
                Contact information
              </Text>
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                {activity.contactEmails?.map((email, index) => (
                  <ContactInfoBox
                    key={email}
                    Icon={Envelope}
                    link={`mailto:${email}`}
                    value={email}
                    styles={{
                      borderBottomWidth: 1,
                    }}
                  />
                ))}
                {activity.contactPhones?.map((phone, index) => (
                  <ContactInfoBox
                    key={phone}
                    Icon={Phone}
                    link={`tel:${phone}`}
                    value={phone}
                    styles={{
                      borderBottomWidth: 1,
                    }}
                  />
                ))}
                {activity.contactURLs?.map((url, index) => (
                  <ContactInfoBox
                    key={url}
                    Icon={Globe}
                    link={url as ExternalPathString}
                    value={url}
                    styles={{
                      borderBottomWidth:
                        index == activity.contactURLs!.length - 1 ? 0 : 1,
                    }}
                  />
                ))}
              </View>
            </View>
            {
              local.debugUITId ? (
                <ViButton
                  title="COPY DEBUG URL"
                  type="light"
                  variant="danger"
                  onPress={async () =>
                    await Clipboard.setStringAsync(local.debugUITId.toString())
                  }
                />
              ) : null
              // <Text>Hardcoded activity</Text>
            }
          </ScrollView>
          <View style={[styles.BottomContainer]}>
            <View style={styles.BottomContainerButton}>
              <ViButton title="Google more" variant="primary" type="outline" />
            </View>
            <View style={styles.BottomContainerButton}>
              <ViButton
                title="Add to calendar"
                variant="primary"
                type="light"
                onPress={() => handleOpenSheet()}
              />
            </View>
          </View>
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
            onChange={handleSheetChanges}
            backgroundStyle={[
              BackgroundColors.background,
              {
                boxShadow: "-10px -10px 10px rgba(0,0,0,0.1)",
              },
            ]}
            enableContentPanningGesture={false} // Prevents modal drag from content
          >
            <PlanningSheetView
              handleClose={handleCloseSheet}
              activity={activity}
              suggestedActivityId={local.suggestedActivityId}
            />
          </BottomSheetModal>
        </>
      ) : (
        <Text>No results?!</Text>
      )}
    </SafeAreaView>
  );
}
interface PlanningSheetViewProps {
  handleClose: () => void;
  activity: ActivityDetails;
  suggestedActivityId?: any;
}
function PlanningSheetView({
  handleClose,
  activity,
  suggestedActivityId,
}: PlanningSheetViewProps) {
  const { getCredentials } = useAuth0();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [startDatePickerMode, setStartDatePickerMode] = useState<
    "datetime" | "date" | "time" | undefined
  >("date");
  const [endDatePickerMode, setEndDatePickerMode] = useState<
    "datetime" | "date" | "time" | undefined
  >("date");
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [posting, setPosting] = useState<boolean>(false);
  const [status, setStatus] = useState<number | null>(null);

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

  async function handleAddEventToPlanner() {
    try {
      setPosting(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;

      const response = await fetch(`${API_URL}/useractivitylist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          activityId: activity.activityId,
          plannedStart: startDateTime.toISOString(),
          plannedEnd: endDateTime.toISOString(),
          suggestedActivityId: suggestedActivityId,
        }),
      });

      setStatus(response.status);
      if (response.status == 200) {
        ToastAndroid.show("Event added!", ToastAndroid.SHORT);
      }
      setPosting(false);
      handleClose();
    } catch (error) {
      console.error("Error fetching activity details:", error);
      setPosting(false);
    }
  }

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
      <View
        style={{
          paddingBlock: 16,
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Text style={textStyles.h3}>Add to my calendar</Text>
      </View>

      {posting ? (
        <Viloader vitoMessage="Adding the event to your calendar!" />
      ) : (
        <View
          style={{
            padding: 16,
            paddingBottom: 32,
            gap: 4,
          }}
        >
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
            <IconButton
              Icon={Calendar}
              onPress={() => {
                setStartDatePickerMode("date");
                setStartDatePickerVisibility(true);
              }}
            >
              {startDateTime.toLocaleDateString("en-us", dateOptions)}
            </IconButton>
            <IconButton
              Icon={Clock}
              onPress={() => {
                setStartDatePickerMode("time");
                setStartDatePickerVisibility(true);
              }}
            >
              {startDateTime.toLocaleTimeString("nl-be", timeOptions)}
            </IconButton>
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
            <IconButton
              Icon={Calendar}
              onPress={() => {
                setEndDatePickerMode("date");
                setEndDatePickerVisibility(true);
              }}
            >
              {endDateTime.toLocaleDateString("en-us", dateOptions)}
            </IconButton>
            <IconButton
              Icon={Clock}
              onPress={() => {
                setEndDatePickerMode("time");
                setEndDatePickerVisibility(true);
              }}
            >
              {endDateTime.toLocaleTimeString("nl-be", timeOptions)}
            </IconButton>
          </View>
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
        <View style={styles.BottomContainerButton}>
          <ViButton
            title="Close"
            variant="primary"
            type="text-only"
            enabled={posting ? false : true}
            onPress={() => handleClose()}
          />
        </View>
        <View style={styles.BottomContainerButton}>
          <ViButton
            title="Add "
            variant="primary"
            type="light"
            enabled={posting ? false : true}
            onPress={handleAddEventToPlanner}
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

interface IconButtonProps {
  Icon: Icon;
  onPress: () => void;
  children: any;
}
const IconButton = ({ Icon, onPress, children }: IconButtonProps) => {
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
          style={[
            styles.Card,
            {
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            },
          ]}
        >
          <Icon />
          <Text>{children}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
interface infoBoxProps {
  activity: ActivityDetails;
  Icon: Icon;
  label: string;
  value: string;
}
const CoreInfoBox = ({ activity, Icon, label, value }: infoBoxProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        padding: 4,
        flex: 1,
      }}
    >
      <Icon size={20} color={TextColors.muted.color} />
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <Text style={[textStyles.bodySmall, TextColors.muted]}>{label}</Text>
        <Text
          style={[
            textStyles.bodyLarge,
            {
              top: -3,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

interface contactBoxInfo {
  Icon: Icon;
  link: ExternalPathString;
  value: string;
  styles: any;
}
const ContactInfoBox = ({ Icon, link, value, styles }: contactBoxInfo) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: adjustLightness(TextColors.muted.color, 55),
        alignItems: "center",
        gap: 4,
        paddingBlock: 4,
        ...styles,
      }}
    >
      <Icon size={16} color={TextColors.muted.color} />
      <Link
        href={link}
        numberOfLines={1}
        style={{
          textDecorationStyle: "solid",
          textDecorationLine: "underline",
        }}
      >
        {value}
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingInline: 16,
    flexDirection: "column",
    gap: 15,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
  Card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    gap: 4,
  },
  BottomContainerButton: { flex: 1 },
  tagsContainer: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
});
