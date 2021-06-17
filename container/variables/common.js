import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 750;
const ratio = width / guidelineBaseWidth;

export const scale = (size) => ratio * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

//Guideline sizes are based on standard ~5" screen mobile device

export const isIphoneX =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926);

export const color = {
  background: "#15A89E",
  input: "#F5EDF6",
  backgroundColor: "#F4F5F8",
  topBarButtonColor: "#FFF",
  topBarTextColor: "#FFF",
  topBarBgColor: "#15A89E",
  text: "#3F3F3F",
  action: "#9A41AB",
  fontColor: "#707070",
  disable: "#9F9F9F",
  hint: "#BBBBBB",
  grey: "#B0B0B0",
  lightGrey: "#d3d3d3",
  lightGreyPlus: "#e8e8e8",
  warning: "#f0ad4e",
  danger: "#DF3651",
  success: "#5cb85c",
  info: "#5bc0de",
  primary: "#00aaaa",
  border: "#707070",
  dark: "#000000",
  light: "#f7f7f7",
  inverse: "#292b2c",
  orange: "#f0ad4e",
  red: "#DF3651",
  green: "#5cb85c",
  colorMandy: "#E24F63",
  lightGreen: "#d0ffd0",
  unread: "#ddefef",
  change: "#f6c065",
  remove: "#eb596e",
  deadline: "#583d72",
  create: "#00917c",
  cancel: "#898b8a",
  done: "#0278ae",
  blue: "#0275d8",
};

export const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.34,
  shadowRadius: 6.27,

  elevation: 10,
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
