import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  
} from "container/variables/common";

export default StyleSheet.create({
  bodyBox: { height: scale(800), marginBottom: scale(30) },
  createButton: {
    flex: 1,
    padding: scale(20),
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    
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
