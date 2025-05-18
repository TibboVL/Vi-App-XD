import { ViButton } from "@/components/ViButton";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { router } from "expo-router";
const globStyles = require("../../../globalStyles");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function OnboardingNotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}>
        <View
          style={{
            width: "100%",
            flex: 4,
            justifyContent: "center",
            alignItems: "center",
            gap: 64,
          }}
        >
          <Text style={[globStyles.h3, { textAlign: "center" }]}>
            One last thing
          </Text>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            <VitoLookDown />
            <NotificiationSVG />
          </View>
          <Text style={[globStyles.bodyLarge, { textAlign: "center" }]}>
            To help you stay motivated and on track, we’d love to send you
            gentle reminders.
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 24,
            gap: 8,
            width: "100%",
          }}
        >
          <ViButton title="Maybe later" type="text-only" />
          <ViButton
            title="send test notification"
            onPress={() => schedulePushNotification()}
          />
          <ViButton
            title="complete onboarding"
            onPress={() => router.push("/(authenticated)/(tabs)")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const VitoLookDown = () => {
  return (
    <Svg width={225} height={203} viewBox="0 0 225 203" fill="none">
      <Path
        d="M221.673 97.4126C244.739 16.8795 143.592 -31.7551 50.6105 25.319C-42.2273 82.3931 10.0657 186.957 69.0921 199.974C127.975 212.991 199.466 175.228 221.673 97.4126Z"
        fill="#4DA06D"
      />
      <Circle cx={142} cy={95.5} r={22} fill="white" />
      <Circle cx={83} cy={95.5} r={22} fill="white" />
      <Circle cx={141.5} cy={103} r={11.5} fill="#626262" />
      <Circle cx={81.5} cy={103} r={11.5} fill="#626262" />
      <Path
        d="M99 133.37C106 138.5 121 138.5 127 133.37"
        stroke="white"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
};
const NotificiationSVG = () => {
  return (
    <Svg width={303} height={95} viewBox="0 0 303 95" fill="none">
      <Rect x={25} y={6.5} width={253} height={80} rx={16} fill="#EAF1FB" />
      <Path
        d="M55.9375 58.2085C54.3152 58.2085 53 59.5237 53 61.146C53 62.7683 54.3152 64.0835 55.9375 64.0835L142.062 64.9375C143.685 64.9375 145 63.6223 145 62C145 60.3777 143.685 59.0625 142.062 59.0625L55.9375 58.2085Z"
        fill="#7EACE7"
      />
      <Path
        d="M55.9375 44.5C54.3152 44.5 53 45.8152 53 47.4375C53 49.0598 54.3152 50.375 55.9375 50.375H170.062C171.685 50.375 173 49.0598 173 47.4375C173 45.8152 171.685 44.5 170.062 44.5H55.9375Z"
        fill="#7EACE7"
      />
      <Path
        d="M268.5 29.25C268.5 35.7393 263.24 41 256.75 41C250.26 41 245 35.7393 245 29.25C245 22.7607 250.26 17.5 256.75 17.5C263.24 17.5 268.5 22.7607 268.5 29.25Z"
        fill="#5490DE"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  Container: {
    height: "100%",
    paddingInline: 32,
    flexDirection: "column",
    flex: 1,
    display: "flex",
  },
});
