import { Redirect, SplashScreen, useLocalSearchParams } from "expo-router";
SplashScreen.preventAutoHideAsync();
export default function Index() {
  let isFirstOpen = null;

  const params = useLocalSearchParams();
  const { appFirstOpened } = params; // we need to get this from our database in the future

  // Read the param and translate it to Boolean
  if (appFirstOpened === "true") isFirstOpen = true;
  else isFirstOpen = false;

  return isFirstOpen ? (
    <Redirect href={"/(authenticated)/onboarding"} /> // todo: implement onboarding
  ) : (
    <Redirect href={"/(authenticated)/(tabs)/discover"} />
  );
}
