import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  TouchableNativeFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";
import { Activity, EnergyLevel } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
} from "@/globalStyles";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { Funnel } from "phosphor-react-native";
import { BottomSheetModalRef } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types";
import DropDownPicker from "react-native-dropdown-picker";
import { ViSelect } from "@/components/ViSelect";
import { ViSlider } from "@/components/ViSlider";
import { ViToggleButton } from "@/components/ViToggleButton";
import { getLocation } from "@/helpers/locationHelper";
import { LocationObject } from "expo-location";

export default function ActivitiesScreen() {
  const { getCredentials } = useAuth0();
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const navigation = useNavigation();
  const bottomModalSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenSheet = () => bottomModalSheetRef.current!.present();
  const handleCloseSheet = () => bottomModalSheetRef.current!.close();

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
      console.log(userLocation);
      if (!userLocation?.coords.longitude || !userLocation?.coords.latitude) {
        console.warn("Location not found!!");
        return;
      }
      const response = await fetch(
        `${API_URL}/activities?d=1
        &lon=${userLocation?.coords.longitude.toString()}
        &lat=${userLocation?.coords.latitude.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
    async function fetchLocation() {
      const res = await getLocation();
      setUserLocation(res); // triggers the effect below
    }

    fetchLocation();

    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <TouchableNativeFeedback onPress={() => handleOpenSheet()}>
            <View
              style={{
                padding: 8,
              }}
            >
              <Funnel size={24} style={{}} />
            </View>
          </TouchableNativeFeedback>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!userLocation) return; // wait until location is set
    fetchActivities(); // now it will only run when userLocation is set
  }, [userLocation]);

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
          }}
        >
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
          <BottomSheetModal
            ref={bottomModalSheetRef}
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: BackgroundColors.background,
              boxShadow: "-10px -10px 10px rgba(0,0,0,0.1)",
            }}
            enableContentPanningGesture={false} // Prevents modal drag from content
          >
            <FilterPanel handleCloseSheet={() => handleCloseSheet()} />
          </BottomSheetModal>
        </View>
      )}
    </SafeAreaView>
  );
}

const viPijlers = [
  { label: "Any", value: "" },
  { label: "Social", value: "social" },
  { label: "Skills", value: "skills" },
  { label: "Physical", value: "physical" },
  { label: "Mindfulness", value: "mindfulness" },
];
interface filterPanelProps {
  handleCloseSheet: () => void;
}
const FilterPanel = ({ handleCloseSheet }: filterPanelProps) => {
  const [selectedPijler, setSelectedPijler] = useState("");
  const [distance, setDistance] = useState(50);
  const [energyLevels, setEnergyLevels] = useState<EnergyLevel[]>([]);

  return (
    <BottomSheetView
      style={{
        paddingInline: 16,
        gap: 8,
      }}
    >
      <Text style={textStyles.h3}>Filters</Text>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Duration:</Text>
      </View>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Energy level:</Text>

        <View
          style={{
            flexDirection: "row",
            gap: 4,
          }}
        >
          {Object.entries(EnergyLevel).map(([key, value]) => {
            return (
              <View
                style={{
                  flex: 1,
                }}
              >
                <ViToggleButton
                  title={value}
                  key={key}
                  state={energyLevels.includes(value)}
                  onPress={() => {
                    energyLevels.includes(value)
                      ? setEnergyLevels(
                          energyLevels.filter((level) => level != value)
                        )
                      : setEnergyLevels([...energyLevels, value]);
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Distance: {distance}km</Text>
        <ViSlider
          minValue={5}
          maxValue={50}
          value={distance}
          step={5}
          onChange={(val) => setDistance(val)}
        />
      </View>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Price:</Text>
      </View>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Can do together:</Text>
      </View>
      <View
        style={{
          gap: 4,
        }}
      >
        <Text style={textStyles.bodyLarge}>Categories:</Text>
        <ViSelect
          variant="secondary"
          selectedValue={selectedPijler}
          onValueChange={(itemValue) => setSelectedPijler(itemValue)}
          options={viPijlers}
        />
      </View>
      <View style={{ width: "100%" }}>
        <ViButton title="Apply" onPress={() => handleCloseSheet()} />
      </View>
    </BottomSheetView>
  );
};

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
