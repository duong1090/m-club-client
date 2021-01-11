import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";

export const AVATAR_SIZE = scale(50);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  filter: {
    margin: scale(20),
    borderBottomWidth: scale(4),
    paddingBottom: scale(20),
    borderColor: color.backgroundColor,
  },
  filterHeader: {
    flexDirection: "row",
  },
  filterAdvanced: {
    marginTop: scale(10),
    flexDirection: "row",
    backgroundColor: color.backgroundColor,
    borderRadius: space.border,
  },
  filterItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  filterItemText: {
    ...defaultText,
    marginRight: scale(10),
  },
  filterBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: scale(20),
  },
  filterIcon: {
    color: color.grey,
    fontSize: scale(30),
  },
  contentMemAvtBox: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
    alignItems: "center",
  },
  contentMemAvt: {
    position: "absolute",
  },
  contentMemAdd: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: scale(2),
    borderColor: color.grey,
    backgroundColor: color.lightGrey,
  },
  contentMemAddIcon: {
    color: color.grey,
    fontSize: scale(25),
  },
  contentMemAvtMore: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    ...shadow,
  },
  contentMemAvtMoreText: {
    ...defaultText,
    fontWeight: "bold",
    color: "#fff",
  },
  contentMemName: {
    ...defaultText,
    maxWidth: "75%",
    marginRight: space.itemMargin,
  },
  searchBox: {
    flex: 1,
  },
  tabWrapper: {
    height: scale(80),
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: scale(-2),
    marginHorizontal: scale(10),
  },
  tabBarUnderlineStyle: {
    height: 0,
  },
  dot: {
    position: "absolute",
    top: scale(-20),
    right: scale(-20),
    justifyContent: "center",
    alignItems: "center",
    height: scale(45),
    width: scale(45),
    borderRadius: scale(23),
    backgroundColor: color.danger,
  },
  boxEmpty: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent,
  },
  actionButtonBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scale(15),
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    backgroundColor: color.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: space.border,
    ...shadow,
  },
  actionButtonText: {
    ...defaultText,
    color: "#fff",
  },
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
  headingBox: {
    width: scale(200),
    marginTop: scale(20),
    marginRight: scale(20),
    backgroundColor: color.info,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
    backgroundColor: color.backgroundColor,
  },
  childrenItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: scale(20),
    marginTop: scale(15),
    ...shadow,
  },
  childrenItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    flex: 1,
  },
  childrenItemPriorLevel: (level) => ({
    height: scale(50),
    aspectRatio: 1,
    backgroundColor: ["transparent", color.green, color.orange, color.red][
      level
    ],
    borderRadius: scale(15),
    marginRight: scale(20),
  }),
  childrenItemBtnDone: {
    marginLeft: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
  },
  childrenItemDone: (isDone) => ({
    ...defaultText,
    fontSize: scale(50),
    color: isDone ? color.green : color.text,
  }),
});
