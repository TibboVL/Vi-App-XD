import { ViButton } from "@/components/ViButton";
import {
  ExternalPathString,
  Link,
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
  TextColors,
  BackgroundColors,
} from "@/globalStyles";
import { useRef, useState } from "react";
import { ActivityDetails, PillarKey } from "@/types/activity";
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
import { EnergyIcon } from "@/components/EnergyIcon";
import { useQueryClient } from "@tanstack/react-query";
import VitoError from "@/components/ViErrorHandler";
import { useGetActivityDetails } from "@/hooks/useActivityDetails";
import { usePostUserActivityList } from "@/hooks/useUserActivityList";
import { ViIconButton } from "@/components/ViIconButton";
import ViCategoryContainer from "@/components/ViCategoryContains";

export default function ActivityDetailsScreen() {
  const local = useLocalSearchParams();
  const bottomModalSheetRef = useRef<BottomSheetModal>(null);
  const handleOpenSheet = () => bottomModalSheetRef.current!.present();
  const handleCloseSheet = () => bottomModalSheetRef.current!.close();

  const {
    isLoading,
    data: activity,
    error,
    refetch,
  } = useGetActivityDetails({
    activityId: local.activityId as string,
  });

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      {isLoading ? (
        <Viloader message="Vito is looking gathering more details..." />
      ) : null}

      {error ? (
        <VitoError error={error} loading={isLoading} refetch={refetch} />
      ) : null}

      {!isLoading && !error && activity ? (
        <>
          <ActivityDetailInformation activity={activity} />
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
      ) : null}
    </SafeAreaView>
  );
}

interface ActivityDeetailInformaationProps {
  activity: ActivityDetails;
  showHeader?: boolean;
  showAbout?: boolean;
  customStyles?: {
    Container?: StyleProp<ViewStyle>;
    ContentContainer?: StyleProp<ViewStyle>;
  };
}
export const ActivityDetailInformation = ({
  activity,
  showHeader = true,
  showAbout = true,
  customStyles,
}: ActivityDeetailInformaationProps) => {
  const [descriptionExpandedState, setDescriptionExpandedState] =
    useState<boolean>(false);

  function toggleDescriptionState() {
    setDescriptionExpandedState(!descriptionExpandedState);
  }

  const openInMaps = () => {
    let url = `https://www.google.com/maps/search/?api=1&query=${activity.locationLatitude},${activity.locationLongitude}`;
    if (activity.locationStreetAddress) {
      const address = `${
        activity.locationStreetAddress
          ? activity.locationStreetAddress + ", "
          : "null"
      }${activity.locationPostcode} ${activity.locationCity}`;
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
    }
    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={[customStyles?.Container, styles.Container]}
      contentContainerStyle={[{ gap: 12 }, customStyles?.ContentContainer]}
    >
      {showHeader ? (
        <View
          id="HeaderInfo"
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Text style={[textStyles.h4]}>{activity.name}</Text>
          <ViCategoryContainer activity={activity} />
        </View>
      ) : null}
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
              activity.estimatedCost ? `€${activity.estimatedCost}` : "Free"
            }
          />
          <CoreInfoBox
            Icon={() => (
              <EnergyIcon
                style={{ color: TextColors.muted.color, marginTop: 8 }}
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
            value={`${activity.minAge ? activity.minAge + " +" : "Any"}`}
          />
        </View>
        {activity.locationName ? (
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <TouchableNativeFeedback
              onPress={activity.locationLongitude ? openInMaps : () => null}
            >
              <View>
                <CoreInfoBox
                  Icon={MapPinLine}
                  activity={activity}
                  label="Location"
                  value={`${
                    activity.locationName ? activity.locationName : "N/A"
                  }`}
                >
                  <Text>
                    {activity.locationStreetAddress
                      ? activity.locationStreetAddress + ", "
                      : ""}
                    {activity.locationPostcode}{" "}
                    {activity.locationCity ? activity.locationCity + ", " : ""}
                    {activity.locationCountry?.toUpperCase()}
                  </Text>
                </CoreInfoBox>
              </View>
            </TouchableNativeFeedback>
          </View>
        ) : null}
      </View>
      {showAbout ? (
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
      ) : null}
      <View
        id="OpeningHours"
        style={[
          styles.Card,
          {
            display:
              activity.openingHoursStructured &&
              activity.openingHoursStructured?.length > 0
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
                borderBottomColor: adjustLightness(TextColors.muted.color, 55),
                justifyContent: "space-between",
                paddingBlock: 4,
                borderBottomWidth: activity.openingHoursStructured
                  ? index == activity.openingHoursStructured.length - 1
                    ? 0
                    : 1
                  : 0,
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
                borderBottomWidth: activity.contactURLs
                  ? index == activity.contactURLs.length - 1
                    ? 0
                    : 1
                  : 0,
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
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

  const handleConfirmStartDate = (date: any) => {
    console.warn("A date has been picked: ", date);
    // if (date > endDateTime) {
    setEndDateTime(date);
    // }
    setStartDatePickerVisibility(false);
    setStartDateTime(date);
  };
  const handleConfirmEndDate = (date: any) => {
    console.warn("A date has been picked: ", date);
    setEndDatePickerVisibility(false);
    setEndDateTime(date);
  };

  const { mutate, isPending, error } = usePostUserActivityList();
  const queryClient = useQueryClient();
  async function handleAddEventToPlanner() {
    mutate(
      {
        activityId: activity.activityId,
        plannedStart: startDateTime,
        plannedEnd: endDateTime,
        suggestedActivityId: suggestedActivityId,
      },
      {
        onSuccess: (data) => {
          handleClose();
          queryClient.invalidateQueries({ queryKey: ["user-activity-list"] });
          router.replace({
            pathname: "/planning",
          });
        },
      }
    );
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
      {error ? (
        <VitoError
          error={error}
          loading={isPending}
          refetch={handleAddEventToPlanner}
        />
      ) : null}

      {isPending ? (
        <Viloader inPopup={true} message="Adding the event to your calendar!" />
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
            enabled={isPending ? false : true}
            onPress={() => handleClose()}
          />
        </View>
        <View style={styles.BottomContainerButton}>
          <ViButton
            title="Add "
            variant="primary"
            type="light"
            enabled={isPending ? false : true}
            onPress={() => handleAddEventToPlanner()}
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

interface infoBoxProps {
  activity: ActivityDetails;
  Icon: Icon;
  label: string;
  value: string;
  children?: any;
}
const CoreInfoBox = ({
  activity,
  Icon,
  label,
  value,
  children,
}: infoBoxProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "flex-start",
        padding: 4,
        flex: 1,
      }}
    >
      <Icon
        size={20}
        style={{
          marginTop: 8,
        }}
        color={TextColors.muted.color}
      />
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
        {children}
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
});
