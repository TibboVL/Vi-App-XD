import { ViButton } from "@/components/ViButton";
import { ViActivitySuggestion } from "@/components/ViActivitySuggestion";
import { StyleSheet, View, Text, ToastAndroid, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const globStyles = require("../../../../globalStyles");

export default function DiscoverScreen() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <ScrollView contentContainerStyle={styles.Container}>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "90%",
              gap: 8,
            }}
          >
            <Text
              style={[
                globStyles.h3,
                {
                  textAlign: "center",
                  paddingBlock: 8,
                },
              ]}
            >
              Suggestions for you
            </Text>
            <ViActivitySuggestion
              title="Go on a hike with the CMU Hiking Club"
              tags={[
                { label: "Walking", pillar: "sports" },
                { label: "Mindfulness", pillar: "mindfulness" },
              ]}
              energylevel="High"
              duration="30m"
              cost="20"
              distance="5 km"
              shareable={true}
              activityType="hiking"
            />
            <ViActivitySuggestion
              title="Swimming event at the local pool"
              tags={[
                { label: "Swimming", pillar: "sports" },
                { label: "Socializing", pillar: "connections" },
              ]}
              energylevel="Medium"
              duration="60m"
              cost="10"
              distance="<1 km"
              shareable={true}
              activityType="swimming"
            />
            <ViActivitySuggestion
              title="Join the CMU Coding Club"
              tags={[
                { label: "Coding", pillar: "skills" },
                { label: "Socializing", pillar: "connections" },
              ]}
              energylevel="Low"
              duration="90m"
              cost="Free"
              distance="<1 km"
              shareable={true}
              activityType="coding"
            />

            <Text>placeholder content to test scrolling</Text>
            <Text>
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting, remaining essentially
              unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum. Why do we use it? It is a long
              established fact that a reader will be distracted by the readable
              content of a page when looking at its layout. The point of using
              Lorem Ipsum is that it has a more-or-less normal distribution of
              letters, as opposed to using 'Content here, content here', making
              it look like readable English. Many desktop publishing packages
              and web page editors now use Lorem Ipsum as their default model
              text, and a search for 'lorem ipsum' will uncover many web sites
              still in their infancy. Various versions have evolved over the
              years, sometimes by accident, sometimes on purpose (injected
              humour and the like). Where does it come from? Contrary to popular
              belief, Lorem Ipsum is not simply random text. It has roots in a
              piece of classical Latin literature from 45 BC, making it over
              2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more
              obscure Latin words, consectetur, from a Lorem Ipsum passage, and
              going through the cites of the word in classical literature,
              discovered the undoubtable source. Lorem Ipsum comes from sections
              1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The
              Extremes of Good and Evil) by Cicero, written in 45 BC. This book
              is a treatise on the theory of ethics, very popular during the
              Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
              amet..", comes from a line in section 1.10.32. The standard chunk
              of Lorem Ipsum used since the 1500s is reproduced below for those
              interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum
              et Malorum" by Cicero are also reproduced in their exact original
              form, accompanied by English versions from the 1914 translation by
              H. Rackham.
            </Text>
          </View>
        </ScrollView>
        <View style={[styles.BottomContainer]}>
          <ViButton
            title="Explore More Activities"
            variant="primary"
            type="light"
            onPress={() => {
              ToastAndroid.show("Explore More Activities", ToastAndroid.SHORT);
            }}
          />
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
  BottomContainer: {
    paddingBlock: 16,
    paddingInline: 16,
    flexDirection: "row",
    width: "100%",
    display: "flex",
    gap: 8,
  },
});
