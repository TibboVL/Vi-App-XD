import {
  safeAreaEdges,
  safeAreaStyles,
  TextColors,
  textStyles,
} from "@/globalStyles";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ViButton } from "@/components/ViButton";
import { router, useNavigation } from "expo-router";
import { CompactUserActivityListItem } from "@/types/userActivityList";
import { Viloader } from "@/components/ViLoader";
import {
  CheckinContextAction,
  useCheckinDispatch,
  useCheckinState,
} from "./checkinContext";
import {
  useGetUserActivityListsItemsReview,
  usePostUserActivityListItemReview,
} from "@/hooks/useUserActivityList";
import VitoError from "@/components/ViErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { AgendaItem } from "@/components/ViAgendaItem";
import { usePreventUserBack } from "@/hooks/usePreventBack";
import ContextDebugView from "./checkinContextDebug";

export default function ActivityReviewScreen() {
  usePreventUserBack();

  const state = useCheckinState();
  const dispatch = useCheckinDispatch();
  const [selectedReviewItemId, setSelectedReviewItemId] = useState<
    number | null
  >(null);
  const [allowedToFetchList, setAllowedToFetchList] = useState<boolean>(false);

  const {
    isLoading,
    data: userActivityListItemsToBeReviewed,
    error: fetchError,
    refetch,
  } = useGetUserActivityListsItemsReview({ enabled: allowedToFetchList });

  function toggleActivityId(activityId: number) {
    selectedReviewItemId == activityId
      ? setSelectedReviewItemId(null)
      : setSelectedReviewItemId(activityId);
  }

  function handleSetContextForActivityReview(reviewing: boolean) {
    dispatch({
      action: CheckinContextAction.SET_USER_ACTIVITY, // automatically resets the rest
      payload: {
        userActivityId: reviewing ? selectedReviewItemId : null,
        compactUserActivityListItem: reviewing
          ? userActivityListItemsToBeReviewed?.find(
              (ual) => ual.userActivityId == selectedReviewItemId
            )
          : null,
      },
    });
  }

  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error: postError,
  } = usePostUserActivityListItemReview();
  async function handlePostCheckin() {
    mutate(
      {
        beforeMoodId: state.moodBefore,
        afterMoodId: state.moodAfter,
        beforeEnergy: state.energyBefore,
        afterEnergy: state.energyAfter,
        userActivityId: state.userActivityId,
        comments: state.comments,
      },
      {
        onSuccess: (data) => {
          if (data.afterMoodId == null) {
            queryClient.invalidateQueries({
              queryKey: ["last-valid-checkin"],
              refetchType: "active",
            }); // we added a freestanding checkin so we want to invalidate the cache of the query so our mood screen updates
          }
          setAllowedToFetchList(true);
          if (state.isOnboarding) {
            router.replace("/onboarding/location");
          }
        },
        onError: (error) => {
          console.warn(error);
        },
      }
    );
  }
  useEffect(() => {
    if (state.moodBefore != null && state.energyBefore != null) {
      handlePostCheckin(); // if data is already in the context we should send it to the backend
    } else {
      setAllowedToFetchList(true);
    }
  }, []);

  const insets = useSafeAreaInsets();

  if (state.isOnboarding) {
    return <Viloader message="Working on it!" />;
  }

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
      <ContextDebugView />
      <View
        style={[
          styles.Container,
          {
            paddingBottom: insets.top,
          },
        ]}
      >
        {isLoading ? (
          <Viloader message="Vito is looking through your plans!" />
        ) : null}
        {fetchError ? (
          <VitoError error={fetchError} loading={isLoading} refetch={refetch} />
        ) : null}
        {postError ? <VitoError error={postError} loading={isPending} /> : null}
        {userActivityListItemsToBeReviewed ? (
          <View style={{ flex: 1, width: "100%" }}>
            <View
              style={{
                width: "100%",
                paddingBlock: 32 + 16,
              }}
            >
              <Text
                style={[
                  textStyles.h4,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                Here’s what you planned earlier
              </Text>
              <Text
                style={[
                  textStyles.h4,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                How did it go?
              </Text>
            </View>
            <FlatList
              style={{
                flex: 1,
                width: "100%",
              }}
              data={userActivityListItemsToBeReviewed}
              renderItem={(content) => (
                <AgendaItem
                  item={content.item}
                  includeDate={true}
                  selected={selectedReviewItemId == content.item.userActivityId}
                  onPress={() => toggleActivityId(content.item.userActivityId)}
                />
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    width: "100%",
                    paddingBlock: 32 * 6,
                    //backgroundColor: "red",
                  }}
                >
                  No planned activities to review!
                </Text>
              }
            />
            <Text
              style={[
                textStyles.bodySmall,
                TextColors.muted,
                {
                  textAlign: "center",
                  width: "100%",
                  paddingBlock: 32,
                  paddingInline: 16,
                },
              ]}
            >
              The more you share, the better Vi gets at helping you move
              forward. Let’s reflect on how things went!
            </Text>
          </View>
        ) : null}
        <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
          <View style={{ flex: 1 }}>
            <ViButton
              title="Maybe later"
              variant="primary"
              type="text-only"
              onPress={() => {
                handleSetContextForActivityReview(false); // also clear when leaving
                router.replace({
                  pathname: "/mood",
                });
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ViButton
              enabled={selectedReviewItemId ? true : false}
              title="Review now"
              variant="primary"
              type="light"
              onPress={() => {
                handleSetContextForActivityReview(true);
                router.replace("/mood/moodPicker");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const CheckinAgendaItemWrapper = ({
  compactUserActivityListItem,
}: {
  compactUserActivityListItem: CompactUserActivityListItem | null;
}) => {
  return (
    <View
      style={{
        width: "100%",
        minHeight: 64 * 1,
      }}
    >
      {compactUserActivityListItem ? (
        <AgendaItem
          onPress={() => null}
          includeDate={true}
          item={compactUserActivityListItem}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    paddingInline: 16,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    minHeight: 90,
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
});
