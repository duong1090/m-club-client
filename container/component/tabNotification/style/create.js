import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
} from "container/variables/common";

export default StyleSheet.create({
  bodyBox: { height: scale(800), marginBottom: scale(30) },
  createButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    alignSelf: "flex-end",
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    ...defaultText,
    color: "#fff",
  },
  inputField: {
    marginBottom: space.componentMargin,
  },
  pickerBox: {},

  deadlineBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  dueDateWrap: {
    marginRight: scale(50),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
