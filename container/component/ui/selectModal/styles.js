import {
  scale,
  color,
  fontSize,
  space,
  
  shadow,
} from "container/variables/common";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
  },

  modalView: {
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    backgroundColor: "white",
  },

  headerView: {
    alignItems: "center",
    justifyContent: "center",
    height: scale(100),
    borderBottomColor: "#cccc",
    borderBottomWidth: 1,
  },

  headerText: {
    
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  closeIconWrapper: { position: "absolute", right: 24 },

  closeIcon: {
    textAlign: "center",
    fontSize: scale(30),
    width: scale(50),
  },

  contentWrapper: {},

  btnStyle: {
    marginHorizontal: space.componentMargin,
    marginBottom: space.itemMargin,
    borderRadius: space.border,
    backgroundColor: color.success,
    paddingVertical: space.itemMargin,
    alignItems: "center",
    justifyContent: "center",
  },

  bodyBox: {},

  btnText: {  color: "#ffffff", fontWeight: "bold" },
});
