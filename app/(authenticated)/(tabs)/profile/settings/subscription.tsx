import { lightStyles, ViButton } from "@/components/ViButton";
import { ViDivider } from "@/components/ViDivider";
import { ViInput } from "@/components/ViInput";
import {
  safeAreaEdges,
  safeAreaStyles,
  TextColors,
  textStyles,
} from "@/globalStyles";
import {
  useChangePlan,
  useGetActiveSubscription,
  useGetAvalablePlans,
} from "@/hooks/useSubscription";
import { router } from "expo-router";
import { Check, Crown, Icon, Lightning } from "phosphor-react-native";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoreInfoBox } from "../../discover/[activityId]";
import { useQueryClient } from "@tanstack/react-query";

export default function SubscriptionScreen({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  var dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;

  const {
    isLoading: loadingPlans,
    data: plans,
    error: planError,
  } = useGetAvalablePlans();
  const {
    isLoading: loadingSubscription,
    data: subscription,
    error: subscriptionError,
    refetch: refreshCurrentSubscription,
  } = useGetActiveSubscription();

  const { mutate, isPending, error } = useChangePlan();
  const queryClient = useQueryClient();
  async function handleChangePlan(planId: number) {
    mutate(
      {
        planId: planId,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["suggested-activity-list"],
          });
          queryClient
            .invalidateQueries({ queryKey: ["get-active-subscription"] })
            .then(() => refreshCurrentSubscription());
        },
      }
    );
  }

  return (
    <SafeAreaView style={[!embedded && safeAreaStyles]} edges={safeAreaEdges}>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <ScrollView style={[styles.Container]}>
          <View
            style={{
              flexDirection: "column",
              gap: 8,
            }}
          >
            {subscription ? (
              <View id="currentPlan" style={styles.Card}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={textStyles.h4}>Current plan</Text>
                  <Text>Active</Text>
                </View>
                <MonthlyPriceContainer
                  Icon={Lightning}
                  name={subscription.name}
                  price={subscription.price}
                />
                <ViDivider
                  style={{
                    marginBlock: 8,
                    opacity: 0.5,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <CoreInfoBox
                    label="AI Requests/day"
                    value={subscription?.maxAIRequestsPerDay?.toString() ?? ""}
                  />
                  <CoreInfoBox
                    label="AI Results shown"
                    value={subscription?.maxAIResultsShown?.toString() ?? ""}
                  />
                </View>
                {subscription.slug != "free" ? (
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <CoreInfoBox
                      label="Next billing"
                      value={
                        subscription.endDate
                          ? new Date(subscription.endDate).toLocaleDateString(
                              "nl-be",
                              dateOptions
                            )
                          : "N/A"
                      }
                    />
                    <CoreInfoBox
                      label="Auto renew"
                      value={subscription?.autoRenew ? "On" : "Off"}
                    />
                  </View>
                ) : null}
                <ViButton
                  title="Cancel subscription"
                  variant="danger"
                  enabled={subscription.slug != "free"}
                  onPress={() => {
                    const freeID = plans?.find(
                      (plan) => plan.slug == "free"
                    )?.planId;
                    freeID ? handleChangePlan(freeID) : null;
                  }}
                />
              </View>
            ) : null}

            {plans ? (
              <View
                style={{
                  gap: 8,
                }}
              >
                <Text
                  style={[
                    textStyles.h3,
                    {
                      paddingTop: 8,
                    },
                  ]}
                >
                  Avalable plans
                </Text>

                {plans.map((plan) => {
                  return (
                    <View key={plan.planId} style={styles.Card}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 8,

                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          {plan.slug == "free" ? <Lightning /> : <Crown />}
                          <Text style={textStyles.h4}>{plan.name}</Text>
                        </View>
                        <Text>
                          {subscription?.slug == plan.slug ? "Current" : ""}
                        </Text>
                      </View>
                      <MonthlyPriceContainer price={plan.price} />
                      <View
                        style={{
                          paddingBlock: 8,
                          gap: 4,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <Check
                            size={18}
                            color={lightStyles.primary.backgroundColor}
                            weight="bold"
                          />
                          <Text>
                            {plan.maxAIRequestsPerDay} AI Requests per day
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <Check
                            size={18}
                            color={lightStyles.primary.backgroundColor}
                            weight="bold"
                          />
                          <Text>{plan.maxAIResultsShown} Results shown</Text>
                        </View>
                      </View>
                      <ViButton
                        title={
                          subscription?.slug == plan.slug
                            ? "Current plan"
                            : "Switch plan"
                        }
                        enabled={subscription?.slug != plan.slug}
                        onPress={() => {
                          handleChangePlan(plan.planId);
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

interface MonthlyPriceContainerProps {
  name?: string;
  Icon?: Icon;
  price: number;
}
function MonthlyPriceContainer({
  name,
  Icon,
  price,
}: MonthlyPriceContainerProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        transform: [
          {
            translateY: 2,
          },
        ],
      }}
    >
      {Icon ? <Icon /> : null}
      <View>
        {name ? <Text style={{ fontWeight: 600 }}>{name} plan</Text> : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            transform: [
              {
                translateY: -2,
              },
            ],
          }}
        >
          <Text style={[textStyles.h4]}>€{price}</Text>
          <Text style={TextColors.muted}>/month</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingInline: 16,
    flexDirection: "column",
    gap: 8,
  },
  Card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    gap: 8,
  },
});
