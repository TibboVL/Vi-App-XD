import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableNativeFeedback,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { EnergyLevel, Pillars } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
  textStyles,
} from "@/globalStyles";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { Funnel } from "phosphor-react-native";
import { ViSelect } from "@/components/ViSelect";
import { ViSlider } from "@/components/ViSlider";
import { ViToggleButton } from "@/components/ViToggleButton";
import { getLocation } from "@/helpers/locationHelper";
import { LocationObject } from "expo-location";
import VitoError from "@/components/ViErrorHandler";
import { useGetActivityList } from "@/hooks/useActivityList";

export default function ActivitiesScreen() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const navigation = useNavigation();
  const bottomModalSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenSheet = () => bottomModalSheetRef.current!.present();
  const handleCloseSheet = () => bottomModalSheetRef.current!.close();

  const { isLoading, data, error, refetch } = useGetActivityList({
    enabled: userLocation?.coords != undefined,
    lon: userLocation?.coords.longitude,
    lat: userLocation?.coords.latitude,
  });

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

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      {isLoading ? (
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
      ) : null}
      {error ? (
        <VitoError error={error} loading={isLoading} refetch={refetch} />
      ) : null}
      {!isLoading && !error && data ? (
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
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            data={data}
            keyExtractor={(item) => item.activityId?.toString()}
            style={styles.FlatListStyles}
            contentContainerStyle={{
              gap: 8,
            }}
            renderItem={({ item }) => <ViActivitySuggestion activity={item} />}
            ListEmptyComponent={<Text>Something went wrong!</Text>}
          />

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
            <FilterPanel handleCloseSheet={() => handleCloseSheet()} />
          </BottomSheetModal>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

interface filterPanelProps {
  handleCloseSheet: () => void;
}
const FilterPanel = ({ handleCloseSheet }: filterPanelProps) => {
  const [selectedPijler, setSelectedPijler] = useState("");
  const [distance, setDistance] = useState(50);
  const [energyLevels, setEnergyLevels] = useState<EnergyLevel[]>([]);

  const viPijlers = [
    { label: "Any", value: "" },
    ...Object.entries(Pillars).map(([key, value]) => ({
      label: key,
      value: value.title,
    })),
  ];

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
                key={key}
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
  FlatListStyles: {
    width: "100%",
    height: "100%",
    gap: 8,
    marginBlock: 0,
    paddingInline: 16,
    flexDirection: "column",
  },
});
