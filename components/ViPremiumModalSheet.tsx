import SubscriptionScreen from "@/app/(authenticated)/(tabs)/profile/settings/subscription";
import { BackgroundColors, textStyles } from "@/globalStyles";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

interface ViPremiumModalSheetProps {
  BottomSheetModalRef: React.RefObject<BottomSheetModal>;
  handleClose: () => void | undefined;
  handleOpen: () => void | undefined;
}
export const ViPremiumModalSheet = ({
  BottomSheetModalRef,
  handleClose,
  handleOpen,
}: ViPremiumModalSheetProps) => {
  return (
    <BottomSheetModal
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
      ref={BottomSheetModalRef}
      backgroundStyle={[
        BackgroundColors.background,
        {
          boxShadow: "-10px -10px 10px rgba(0,0,0,0.1)",
        },
      ]}
      //enableContentPanningGesture={false} // Prevents modal drag from content
    >
      <BottomSheetView>
        <View
          style={{
            paddingBlock: 16,
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              textStyles.h3,
              {
                paddingBlock: 16,
              },
            ]}
          >
            Upgrade to Vi-Premium!
          </Text>

          <View
            style={{
              width: "100%",
            }}
          >
            <SubscriptionScreen embedded={true} />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
