// locationHelper.ts
import * as Location from "expo-location";

let cachedLocation: Location.LocationObject | null = null;
let cachedReverseGeocodedLocation: Location.LocationGeocodedAddress[] | null =
  null;

export async function getLocation(forceRefresh?: boolean) {
  if (cachedLocation && !forceRefresh) {
    return cachedLocation;
  }
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission denied");
  }
  cachedLocation = await Location.getCurrentPositionAsync({});
  return cachedLocation;
}

export async function getReverseGeocodedLocation() {
  if (cachedReverseGeocodedLocation) {
    return cachedReverseGeocodedLocation;
  }
  if (!cachedLocation) {
    await getLocation();
  }

  // extract latitude & longitude
  const coords = {
    latitude: cachedLocation!.coords.latitude,
    longitude: cachedLocation!.coords.longitude,
  };

  cachedReverseGeocodedLocation = await Location.reverseGeocodeAsync(coords);
  return cachedReverseGeocodedLocation;
}
