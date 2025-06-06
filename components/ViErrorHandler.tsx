import * as React from "react";
import { ScrollView, Text, View } from "react-native";
import { ViButton } from "./ViButton";
import { getViFriendlyErrorMessage } from "@/helpers/errorHelper";
import { ViCustomError } from "@/hooks/apiClient";
import { RefreshControl } from "react-native-gesture-handler";

interface VitoErrorProps {
  error: ViCustomError;
  loading: boolean;
  refetch?: () => Promise<any>;
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
    {refetch ? (
      <View style={{ width: 200 }}>
        <ViButton title="Try again" onPress={refetch} />
      </View>
    ) : null}
  </ScrollView>
);
export default VitoError;
