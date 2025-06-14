import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { ToastAndroid } from "react-native";

export function usePreventUserBack() {
  const navigation = useNavigation();

  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      // ONLY block the back action!! do not prevent router.replace!!
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
        ToastAndroid.show("Cannot go back now", ToastAndroid.SHORT);
      }
    });

    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, [navigation]);
}
