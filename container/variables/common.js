import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 750;
const ratio = width / guidelineBaseWidth;

export const scale = (size) => ratio * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

export const color = {
  background: "#9A41AB",
  backgroundColor: "#F1F1F1",
  topBarButtonColor: "#3F3F3F",
  topBarTextColor: "#3F3F3F",
  topBarBgColor: "#fff",
  text: "#3F3F3F",
  action: "#9A41AB",
  fontColor: "#707070",
  disable: "#9F9F9F",
  hint: "#BBBBBB",
  warning: "#f0ad4e",
  danger: "#DF3651",
  success: "#5cb85c",
  info: "#5bc0de",
  primary: "#0275d8",
  border: "#707070",
  dark: "#000000",
  light:"#f7f7f7",
  inverse: "#292b2c",
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
  bgPadding: scale(30),
  componentMargin: scale(30),
  itemMargin: scale(20),
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
  color: "#3F3F3F",
  fontFamily: "Roboto-Regular",
};
