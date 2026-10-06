// Compatibility exports for older imports. New code should import from the owning feature folder.
export { COLORS, MobileScreen, ScreenHeader } from "./common/AppShell";
export {
  default as HomeScreen,
  HomeHeader,
  HumanFigure,
} from "../screens/home/HomeScreen";
export { WellnessCardList } from "./wellness/WellnessCardList";
export { default as TrailScreen } from "../screens/trail/TrailScreen";
