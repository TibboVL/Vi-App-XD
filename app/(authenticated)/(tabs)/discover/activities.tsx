import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  act,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";
import { minutesToHoursMinutes } from "@/helpers/dateTimeHelpers";
import {
  Activity,
  EnergyLevel,
  getPillarInfo,
  PillarKey,
  Pillars,
} from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
} from "@/globalStyles";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function ActivitiesScreen() {
  const { getCredentials } = useAuth0();
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenSheet = () => bottomSheetRef.current!.expand();
  const handleCloseSheet = () => bottomSheetRef.current!.close();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;
      console.log(accessToken);

      if (!accessToken) {
        console.warn("No access token available");
        ToastAndroid.show(
          "Authentication error: no access token",
          ToastAndroid.SHORT
        );
        return;
      }
      console.log("Fetching from:", `${API_URL}/activities`);
      const response = await fetch(`${API_URL}/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch activities:", response);
        ToastAndroid.show(
          `Failed to load activities: ${response.status}`,
          ToastAndroid.SHORT
        );
        return;
      }

      const data = await response.json();
      setActivityList(data.data as Activity[]);
      //console.log(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      ToastAndroid.show(
        "Network error while fetching activities",
        ToastAndroid.SHORT
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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
          <Viloader vitoMessage="Vito is looking for more activities..." />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            /*             gap: 8,
             */
          }}
        >
          {/*  <Modal
            visible={filterSheetOpen}
            transparent={true}
            onRequestClose={() => {
              setFilterSheetOpen(false);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(5px)",
              }}
            >
              <View
                style={{
                  margin: 20,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 35,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text>Filters go here</Text>
                <View style={{ width: 200 }}>
                  <ViButton
                    title="close"
                    onPress={() => setFilterSheetOpen(false)}
                  />
                </View>
              </View>
            </View>
          </Modal> */}
          <View
            style={{
              paddingInline: 16,
              paddingBottom: 8,
            }}
          >
            <ViButton
              title="open filters temp"
              onPress={() => handleOpenSheet()}
            />
          </View>
          <FlatList
            data={activityList}
            keyExtractor={(item) => item.activityId.toString()}
            style={styles.Container}
            contentContainerStyle={{
              gap: 8,
            }}
            renderItem={({ item }) => <ViActivitySuggestion activity={item} />}
            ListEmptyComponent={<Text>Something went wrong!</Text>}
          />
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: BackgroundColors.background,
              boxShadow: "-10px -10px 10px rgba(0,0,0,0.1)",
            }}
          >
            <BottomSheetView
              style={{
                padding: 16,
              }}
            >
              <Text>Filters go here</Text>
              <View style={{ width: 200 }}>
                <ViButton title="close" onPress={() => handleCloseSheet()} />
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    height: "100%",
    gap: 8,
    marginBlock: 0,
    paddingInline: 16,
    flexDirection: "column",
  },
});
