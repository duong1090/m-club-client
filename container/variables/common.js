import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 750;
const ratio = width / guidelineBaseWidth;

export const scale = (size) => ratio * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

export const color = {
  background: "#9A41AB",
  topBarButtonColor: "#9A41AB",
  topBarBgColor: "#9A41AB",
  fontColor: "#707070",
  disable: "#9F9F9F",
};

export const fontSize = {
  size50: scale(50),
  size48: scale(48),
  size44: scale(44),
  size42: scale(42),
  size40: scale(40),
  size36: scale(36),
  size30: scale(30),
  size32: scale(32),
  size28: scale(28),
  size26: scale(26),
  size24: scale(24),
  size22: scale(22),
  size20: scale(20),
  size18: scale(18),
};
