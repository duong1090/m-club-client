import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
  shadow,
} from "container/variables/common";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
  },

  modalView: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "white",
  },

  headerView: {
    alignItems: "center",
    justifyContent: "center",
    height: scale(100),
    borderBottomColor: "#cccc",
    borderBottomWidth: 1,
  },

  headerText: { textAlign: "center", fontSize: 17, fontWeight: "600" },

  closeIconWrapper: { position: "absolute", right: 24 },

  closeIcon: {
    textAlign: "center",
    fontSize: scale(30),
    width: scale(50),
  },

  contentWrapper: {},

  btnStyle: {
    marginHorizontal: space.componentMargin,
    marginVertical: space.itemMargin,
    borderRadius: scale(40),
    backgroundColor: color.background,
    height: scale(80),
    alignItems: "center",
    justifyContent: "center",
  },

  bodyBox: {},

  btnText: { color: "#ffffff", fontWeight: "600" },
});
