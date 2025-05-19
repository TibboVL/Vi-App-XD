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
  StyleProp,
  ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import {
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
  TextColors,
} from "@/globalStyles";
import { useAuth0 } from "react-native-auth0";
import { act, useEffect, useState } from "react";
import { Activity, ActivityDetails } from "@/types/activity";
import Constants from "expo-constants";
import { Viloader } from "@/components/ViLoader";
import {
  BabyCarriage,
  BatteryLow,
  CurrencyEur,
  Envelope,
  Globe,
  Icon,
  MapPinLine,
  Phone,
} from "phosphor-react-native";
import { adjustLightness } from "@/constants/Colors";

export default function ActivityDetailsScreen() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();
  console.log(
    "Local:",
    local.activityId,
    local.title,
    "Global:",
    glob.activityId
  );

  const { getCredentials } = useAuth0();
  const [activity, setActivity] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

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
                  Icon={BatteryLow}
                  activity={activity}
                  label="Required energy"
                  value={activity.energyRequired}
                />
                <CoreInfoBox
                  Icon={BabyCarriage}
                  activity={activity}
                  label="Min age"
                  value={`${activity.minAge} +`}
                />
              </View>
              <CoreInfoBox
                Icon={MapPinLine}
                activity={activity}
                label="Location"
                value={`${activity.locationName}`}
              />
            </View>
            <View id="Description" style={[styles.Card]}>
              <Text style={[textStyles.bodyLarge, { fontWeight: "700" }]}>
                About this event
              </Text>
              <Text
                style={[textStyles.bodyLarge, TextColors.muted]}
                numberOfLines={3}
              >
                {activity.description}
              </Text>
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
            {local.debugUITId ? (
              <ViButton
                title="COPY DEBUG URL"
                type="light"
                variant="danger"
                onPress={async () =>
                  await Clipboard.setStringAsync(local.debugUITId.toString())
                }
              />
            ) : (
              <Text>Hardcoded activity</Text>
            )}
          </ScrollView>
          <View style={[styles.BottomContainer]}>
            <View style={styles.BottomContainerButton}>
              <ViButton title="Google more" variant="primary" type="outline" />
            </View>
            <View style={styles.BottomContainerButton}>
              <ViButton title="Add to agenda" variant="primary" type="light" />
            </View>
          </View>
        </>
      ) : (
        <Text>No results?!</Text>
      )}
    </SafeAreaView>
  );
}
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
});
