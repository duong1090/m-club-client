import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";

export default StyleSheet.create({
  container: {
    padding: space.bgPadding,
  },
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.itemMargin,
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
    paddingBottom: scale(10),
  },
  itemTitle: {
    fontWeight: "bold",
  },
  avatarBox: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  memberName: {
    maxWidth: "75%",
    marginRight: space.itemMargin,
  },
  titleBox: {
    backgroundColor: color.backgroundColor,
    paddingVertical: space.componentMargin,
    paddingHorizontal: space.componentMargin,
    marginBottom: space.componentMargin,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
    textAlign: "center",
  },
});
