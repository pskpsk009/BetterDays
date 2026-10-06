import { Text, View } from "react-native";
import {
  HumanFigure,
  HomeHeader,
  MobileScreen,
} from "../components/mygrowth-ui";

export default function HomeScreen() {
  return (
    <MobileScreen>
      <HomeHeader />
      <View style={{ paddingHorizontal: 4 }}>
        <Text
          style={{
            color: "#1C4C55",
            fontSize: 38,
            lineHeight: 42,
            fontWeight: "800",
            letterSpacing: -1.5,
          }}
        >
          Your Development{`\n`}
          <Text style={{ color: "#247F7B" }}>Starts Here</Text>
        </Text>
        <Text
          style={{
            maxWidth: 310,
            marginTop: 16,
            color: "#6D8589",
            fontSize: 14,
            lineHeight: 22,
          }}
        >
          A healthier mind. A stronger body. A more active you.
        </Text>
      </View>
      <HumanFigure />
      <Text style={{ textAlign: "center", color: "#719095", fontSize: 12 }}>
        {"↓"} Tap the head, body or legs to begin
      </Text>
    </MobileScreen>
  );
}
