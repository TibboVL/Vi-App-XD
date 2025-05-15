import { Redirect, useLocalSearchParams } from "expo-router";

export default function Index() {
  let isFirstOpen = null;

  const params = useLocalSearchParams();
  const { appFirstOpened } = params; // we need to get this from our database in the future

  // Read the param and translate it to Boolean
  if (appFirstOpened === "true") isFirstOpen = true;
  else isFirstOpen = false;

  return isFirstOpen ? (
    <Redirect href={"/(authenticated)/onboarding/privacy"} /> // todo: implement onboarding
  ) : (
    <Redirect href={"/(authenticated)/(tabs)/discover"} />
  );
}
