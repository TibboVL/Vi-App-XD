import { ViButton } from "@/components/ViButton";
import { textStyles } from "@/globalStyles";
import { router } from "expo-router";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const vitoCheckinOnboarding = require("../../../assets/images/vitoCheckinOnboarding.png");
const vitoActivityOnboarding = require("../../../assets/images/vitoActivityOnboarding.png");
const vitoBalanceOnboarding = require("../../../assets/images/vitoBalanceOnboarding.png");
const slides = [
  {
    id: "1",
    image: vitoCheckinOnboarding,
    subtext: "Discover new experiences tailored just for you.",
  },
  {
    id: "2",
    image: vitoActivityOnboarding,
    subtext: "Connect with vibrant communities and local events.",
  },
  {
    id: "3",
    image: vitoBalanceOnboarding,
    subtext: "Track your progress and achieve your goals with ease.",
  },
];

const { width } = Dimensions.get("window");

export default function OnboardingWelcomeScreen() {
  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={styles.slideImage}
        resizeMode="contain"
      />
      <Text style={[textStyles.h3, styles.slideSubtext]}>{item.subtext}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}>
        <View style={styles.contentArea}>
          <Text style={[textStyles.h1, styles.welcomeTitle]}>
            Welcome to Vi!
          </Text>
          <SwiperFlatList
            autoplay={false}
            showPagination
            data={slides}
            renderItem={renderItem}
            paginationStyle={styles.paginationContainer}
            paginationStyleItem={styles.paginationDot}
            paginationStyleItemActive={styles.paginationDotActive}
          />
        </View>
        <View style={styles.buttonArea}>
          <ViButton
            title="Continue"
            onPress={() => router.push("/(authenticated)/onboarding/privacy")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 0,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 0,
  },
  welcomeTitle: {
    textAlign: "center",
    marginBottom: 0,
    marginTop: 100,
    color: "#333",
    paddingHorizontal: 32,
  },
  buttonArea: {
    width: "100%",
    paddingHorizontal: 32,
    marginTop: 0,
  },

  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  slideImage: {
    width: "80%",
    height: 200,
    marginBottom: 15,
    resizeMode: "contain",
  },
  slideSubtext: {
    textAlign: "center",
    color: "#666",
    width: "80%",
  },
  paginationContainer: {
    position: "relative",
    marginTop: 5,
    marginBottom: 120,
  },
  paginationDot: {
    backgroundColor: "rgba(63, 63, 63, 0.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "green",
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
