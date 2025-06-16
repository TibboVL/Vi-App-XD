import { ViButton } from "@/components/ViButton";
import { safeAreaEdges, safeAreaStyles, textStyles } from "@/globalStyles";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  CheckinContextAction,
  types,
  useCheckinDispatch,
  useCheckinState,
} from "./checkinContext";
import ContextDebugView from "./checkinContextDebug";
import { CheckinAgendaItemWrapper } from "./activityReview";
import { usePreventUserBack } from "@/hooks/usePreventBack";
import { useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { adjustLightness } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Plus, X } from "phosphor-react-native";
import { UserActivityComment } from "./checkinContext";

export default function CommentScreen() {
  usePreventUserBack();
  const insets = useSafeAreaInsets();

  const state = useCheckinState();
  const dispatch = useCheckinDispatch();

  const [pros, setPros] = useState<string[]>([]);
  const [neutrals, setNeutrals] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  const bottomModalSheetRef = useRef<BottomSheetModal>(null);
  const textInput = useRef<TextInput>(null);

  const [activeSection, setActiveSection] = useState<keyof typeof types | null>(
    null
  );

  const handleCloseSheet = () => bottomModalSheetRef.current!.close();
  function openDrawer(type: keyof typeof types) {
    setActiveSection(type);
    bottomModalSheetRef.current?.present();
  }

  function handleCompleteActivityReview() {
    dispatch({
      action: CheckinContextAction.SET_COMMENTS,
      payload: [
        ...pros.map(
          (text) =>
            ({
              comment: text,
              type: "pro",
            } as UserActivityComment)
        ),
        ...neutrals.map(
          (text) =>
            ({
              comment: text,
              type: "neutral",
            } as UserActivityComment)
        ),
        ...cons.map(
          (text) =>
            ({
              comment: text,
              type: "con",
            } as UserActivityComment)
        ),
      ],
    });
    router.replace("/mood/activityReview");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 16} // or tweak this value to suit your header height
    >
      <SafeAreaView style={safeAreaStyles} edges={safeAreaEdges}>
        <View
          style={{
            flex: 1,
            paddingBottom: insets.top,
          }}
        >
          <ContextDebugView />
          <CheckinAgendaItemWrapper
            compactUserActivityListItem={state.compactUserActivityListItem}
          />
          <ScrollView
            style={{
              display: "flex",
              paddingInline: 16,
              width: "100%",
              flexDirection: "column",
              flex: 1,
            }}
            contentContainerStyle={{
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Text
              style={[
                textStyles.h4,
                {
                  paddingBlock: 12,
                  paddingInline: 24,
                  width: "100%",
                  textAlign: "center",
                },
              ]}
            >
              Anything else you'd like to add?
            </Text>
            <CommentInputSection
              type={"pro"}
              comments={pros}
              setComments={setPros}
              openDrawer={(type) => openDrawer(type)}
            />
            <CommentInputSection
              type={"neutral"}
              comments={neutrals}
              setComments={setNeutrals}
              openDrawer={openDrawer}
            />
            <CommentInputSection
              type={"con"}
              comments={cons}
              setComments={setCons}
              openDrawer={openDrawer}
            />
          </ScrollView>

          <View id="BottomButtonContainer" style={[styles.BottomContainer]}>
            <ViButton
              title="Continue"
              variant="primary"
              type="light"
              onPress={handleCompleteActivityReview}
            />
          </View>
        </View>
        <BottomSheetModal
          ref={bottomModalSheetRef}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          onDismiss={() => {
            setActiveSection(null);
          }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="none"
            />
          )}
          backgroundStyle={{
            backgroundColor: "white",
          }}
          onChange={(index) => {
            if (index === 0) {
              requestAnimationFrame(() => {
                textInput.current?.focus();
              });
            }
          }}
        >
          <BottomSheetView style={{ padding: 20 }}>
            <Text style={styles.drawerTitle}>
              Add a {activeSection?.toString()} comment
            </Text>
            <TextInput
              ref={textInput}
              style={styles.drawerInput}
              placeholder="Write your comment here..."
              onSubmitEditing={({ nativeEvent }) => {
                const text = nativeEvent.text?.trim();
                if (!text) return;

                if (activeSection === types.pro) setPros([...pros, text]);
                else if (activeSection === types.neutral)
                  setNeutrals([...neutrals, text]);
                else if (activeSection === types.con) setCons([...cons, text]);

                handleCloseSheet();
              }}
              returnKeyType="done"
            />
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function CommentInputSection({
  type,
  comments,
  setComments,
  openDrawer,
}: {
  type: keyof typeof types;
  comments: string[];
  setComments: (newComments: string[]) => void;
  openDrawer: (type: keyof typeof types) => void;
}) {
  function handleRemove(index: number) {
    const newComments = comments.filter((_, i) => i !== index);
    setComments(newComments);
  }

  return (
    <View
      style={{
        flexShrink: 0,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 8,
          paddingBottom: 6,
          paddingTop: 12,
        }}
      >
        <Text style={styles.sectionTitle}>
          {type.toString()[0].toUpperCase() + type.toString().slice(1)}s
        </Text>
        <TouchableNativeFeedback onPress={() => openDrawer(type)}>
          <Plus />
          {/* <Text style={{ fontSize: 24, fontWeight: "bold" }}>＋</Text> */}
        </TouchableNativeFeedback>
      </View>
      <View
        style={{
          padding: 16,
          borderRadius: 16,
          minHeight: 32 + 16,
          backgroundColor: adjustLightness(
            type == types.pro
              ? "#a4f4cf"
              : type == types.neutral
              ? "#cad5e2"
              : "#ffa2a2",
            5
          ),
        }}
      >
        {comments.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.commentText}>- {item}</Text>
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                style={{
                  padding: 0,
                }}
              >
                <X color="#ff3b30" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  addButton: {
    backgroundColor: "#007aff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  commentText: {
    fontSize: 14,
    flex: 1,
  },

  drawerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  drawerTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },

  drawerInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },

  drawerAddButton: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  drawerAddButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
