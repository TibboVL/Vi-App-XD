import { ViError } from "@/hooks/apiClient";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import * as React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import { ViButton } from "./ViButton";
import { getViFriendlyErrorMessage } from "@/helpers/errorHelper";

interface VitoErrorProps {
  error: ViError;
  loading: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}
const VitoError = ({ error, loading, refetch }: VitoErrorProps) => (
  <ScrollView
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    style={{
      width: "100%",
      height: "100%",
      padding: 32,
    }}
    contentContainerStyle={{
      flex: 1,
      gap: 16,

      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* <Text>{error.status}</Text>
    <Text>{error.message}</Text> */}
    <Text
      style={{
        textAlign: "center",
      }}
    >
      {getViFriendlyErrorMessage(error.status)}
    </Text>
    <View style={{ width: 200 }}>
      <ViButton title="Try again" onPress={refetch} />
    </View>
  </ScrollView>
);
export default VitoError;
