import { lightStyles, ViButton } from "@/components/ViButton";
import VitoError from "@/components/ViErrorHandler";
import { Viloader } from "@/components/ViLoader";
import { adjustLightness } from "@/constants/Colors";
import { textStyles } from "@/globalStyles";
import { useGetCurrentGoals } from "@/hooks/useGoals";
import { Link, router } from "expo-router";
import { Gear } from "phosphor-react-native";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useAuth0();

  const { isLoading, data, error, refetch } = useGetCurrentGoals();

  function handleRestartGoals() {
    router.replace({
      pathname: "/onboarding/goals",
      params: {
        viaOnboarding: "false",
      },
    });
  }

  return (
    <SafeAreaView>
      <View style={[styles.Container]}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
              }}
              src={user ? user.picture : undefined}
            />
            <Text
              style={[
                textStyles.h3,
                { textTransform: "capitalize", width: "100%" },
              ]}
            >
              {user ? user.name : "NOT LOGGED IN"}
            </Text>
          </View>

          <Link href={"/(authenticated)/(tabs)/profile/settings"}>
            <View
              style={{
                height: 44,
                width: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Gear size={32} style={{}} />
            </View>
          </Link>
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            width: "100%",
            paddingBlock: 16,
          }}
        >
          <Text style={[textStyles.h3]}>Your goals</Text>
          {isLoading ? (
            <Viloader message="Looking up which goals you chose" />
          ) : null}
          {error ? (
            <VitoError error={error} loading={isLoading} refetch={refetch} />
          ) : null}
          {!isLoading && !error && data ? (
            <View
              style={{
                width: "100%",
                padding: 16,
                backgroundColor: adjustLightness(
                  lightStyles.primary.backgroundColor,
                  15
                ),
                borderRadius: 32,
              }}
            >
              <FlatList
                refreshControl={
                  <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                contentContainerStyle={{
                  gap: 8,
                }}
                ListEmptyComponent={
                  <View>
                    <Text>No goals set yet!</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View
                    style={[
                      {
                        flex: 1,
                        width: "100%",
                        backgroundColor: adjustLightness(
                          lightStyles.primary.backgroundColor,
                          23
                        ),
                        borderRadius: 16,
                        padding: 12,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        textStyles.h4,
                        {
                          fontSize: 16,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                )}
                data={data}
              />
              <View
                style={{
                  paddingTop: 16,
                }}
              >
                <ViButton
                  enabled={!isLoading}
                  title="Edit"
                  onPress={handleRestartGoals}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
});
