import {
  BackgroundColors,
  safeAreaEdges,
  safeAreaStyles,
  TextColors,
  textStyles,
} from "@/globalStyles";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ViButton } from "@/components/ViButton";
import { router, useNavigation } from "expo-router";
import { CompactUserActivityListItem } from "@/types/userActivityList";
import { Activity } from "@/types/activity";
import { Viloader } from "@/components/ViLoader";
import {
  CheckinContextAction,
  useCheckinDispatch,
  useCheckinState,
} from "./checkinContext";
import ContextDebugView from "./checkinContextDebug";
import {
  useGetUserActivityListsItemsReview,
  usePostUserActivityListItemReview,
} from "@/hooks/useUserActivityList";
import VitoError from "@/components/ViErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import ViCategoryContainer from "@/components/ViCategoryContains";

export default function ActivityReviewScreen() {
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
    if (router.canDismiss()) router.dismissAll();
    // const activity = userActivityListItemsToBeReviewed?.find(
    //   (a) => a.userActivityId == selectedReviewItemId
    // );
    // console.log(activity);
    dispatch({
      action: CheckinContextAction.SET_USER_ACTIVITY, // automatically resets the rest
      payload: reviewing ? selectedReviewItemId : null,
    });
  }
  const navigation = useNavigation();
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
      },
      {
        onSuccess: (data) => {
          console.log(data);
          console.log(data.afterMoodId);
          if (data.afterMoodId == null) {
            queryClient.invalidateQueries({
              queryKey: ["last-valid-checkin"],
              refetchType: "active",
            }); // we added a freestanding checkin so we want to invalidate the cache of the query so our mood screen updates
          }
          setAllowedToFetchList(true);
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

    const listener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    return () => {
      navigation.removeListener("beforeRemove", listener);
    };
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
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
                <ReviewItem
                  key={content.index}
                  selected={selectedReviewItemId == content.item.userActivityId}
                  item={content.item}
                  onPress={toggleActivityId}
                />
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    width: "100%",
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
                router.push({
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
                router.push("/mood/moodPicker");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface ReviewItemProps {
  item: CompactUserActivityListItem;
  selected: boolean;
  onPress: (itemId: number) => void;
}
const ReviewItem = ({ item, selected, onPress }: ReviewItemProps) => {
  var options = {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  var DateOptions = {
    month: "long",
    day: "numeric",
    weekday: "short",
  } as Intl.DateTimeFormatOptions;
  const start = new Date(item.plannedStart!).toLocaleTimeString(
    "en-nl",
    options
  );
  const date = new Date(item.plannedStart!).toLocaleDateString(
    "en-nl",
    DateOptions
  );
  const end = new Date(item.plannedEnd!).toLocaleTimeString("en-nl", options);

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderWidth: 2,
          borderColor: selected
            ? BackgroundColors.primary.backgroundColor
            : "transparent",
        },
      ]}
    >
      <TouchableNativeFeedback onPress={() => onPress(item.userActivityId)}>
        <View
          style={[
            styles.card,
            {
              padding: 10,
              paddingInline: 12,
            },
          ]}
        >
          <View>
            <Text style={{ fontWeight: 700 }}>{item.activityTitle}</Text>
            <Text>
              {date} at {start}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ViCategoryContainer
                activity={{ categories: item.categories } as Activity}
              />
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
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
  wrapper: {
    width: "100%",
    marginBlock: 4,
    //marginInline: 16,
    flex: 1, // shrink if needed
    //width: "100%", // expand as much as possible
    borderRadius: 16 + 2,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
  },
});
