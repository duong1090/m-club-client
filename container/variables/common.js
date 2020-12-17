import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 750;
const ratio = width / guidelineBaseWidth;

export const scale = (size) => ratio * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

export const color = {
  background: "#9A41AB",
  backgroundColor: "#F1F1F1",
  topBarButtonColor: "#fff",
  topBarBgColor: "#9A41AB",
  action: "#9A41AB",
  fontColor: "#707070",
  disable: "#9F9F9F",
  hint: "#707070",
  warning: "#F6BE00",
  danger: "#DF3651",
  border: "#707070",
  orange: "#FFAA00",
  red: "#FF0000",
  green: "#009900" 
};

export const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,

  elevation: 3,
};

export const space = {
  bgPadding: scale(20),
  componentMargin: scale(20),
  itemMargin: scale(15),
  border: scale(20),
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
  sizeTitle: scale(32),
  sizeBigContent: scale(30),
  sizeContent: scale(28),
};

export const defaultText = {
  color: "#333",
};
