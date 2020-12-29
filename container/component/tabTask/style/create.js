import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { StyleSheet } from "react-native";

export const AVATAR_SIZE = scale(60);
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  //#region content
  content: {
    backgroundColor: "#fff",
    padding: space.bgPadding,
    borderRadius: scale(10),
    marginHorizontal: scale(15),
    marginTop: scale(15),
    ...shadow,
  },
  contentBody: {
    borderRadius: space.border,
    backgroundColor: color.backgroundColor,
  },
  contentChild: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  contentChildText: {
    ...defaultText,
    fontStyle: "italic",
    fontSize: fontSize.size20,
  },
  contentChildTask: {
    ...defaultText,
    fontSize: fontSize.size22,
    fontStyle: "italic",
    fontWeight: "bold",
    color: color.primary,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.componentMargin - scale(10),
  },
  contentDelete: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: scale(20),
  },
  textDelete: {
    color: color.red,
  },
  contentBtnDelete: {
    flexDirection: "row",
    justifyContent: "center",
    color: color.red,
    marginHorizontal: scale(10),
  },
  contentDeleteIcon: {
    fontSize: scale(30),
    color: color.grey,
    marginHorizontal: scale(10),
    color: color.red,
  },
  contentTitle: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
  },
  contentMem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(20),
    paddingVertical: space.bgPadding,
    borderBottomWidth: scale(2),
    borderColor: color.hint,
  },
  contentMemText: {
    ...defaultText,
    fontWeight: "bold",
    marginRight: space.componentMargin,
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
    fontSize: scale(40),
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
  contentPriority: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    borderBottomWidth: scale(2),
    borderColor: color.hint,
  },
  contentPriorityText: {
    ...defaultText,
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentPriorityBox: (level) => ({
    backgroundColor: [color.green, color.orange, color.red][level],
    paddingHorizontal: scale(30),
    paddingVertical: scale(10),
    borderRadius: space.border,
  }),
  contentPriorityLevel: {
    ...defaultText,
    color: "#fff",
  },
  contentDeadline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
  },
  contentDeadlineText: {
    ...defaultText,
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentDeadlineBox: {
    borderColor: color.danger,
    paddingVertical: scale(10),
  },
  contentDeadlineTime: {
    ...defaultText,
    color: color.danger,
    fontSize: fontSize.size24,
  },
  contentDescription: {
    ...defaultText,
    marginTop: space.componentMargin,
  },

  //#endregion

  //#region children
  children: {
    padding: space.bgPadding,
    marginBottom: space.componentMargin,
    backgroundColor: "#ddd",
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    marginHorizontal: scale(30),
  },
  childrenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  childrenTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.componentMargin,
  },
  childrenTitle: {
    ...defaultText,
    fontWeight: "bold",
  },
  childrenCreateIcon: {
    fontSize: fontSize.size24,
    color: color.primary,
    marginRight: scale(10),
  },
  childrenCreateText: {
    ...defaultText,
    color: color.primary,
  },

  childrenItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(20),
    paddingVertical: scale(10),
    marginBottom: space.itemMargin,
    ...shadow,
  },
  childrenItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  childrenItemPriorLevel: (level) => ({
    height: scale(50),
    aspectRatio: 1,
    backgroundColor: [color.green, color.orange, color.red][level],
    borderRadius: scale(15),
    marginRight: scale(20),
  }),
  childrenItemTitle: {},
  childrenItemDone: (isDone) => ({
    ...defaultText,
    fontSize: scale(50),
    color: isDone ? color.green : color.text,
  }),
  //#endregion

  //#region activity
  activity: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityModal: {},
  activityList: {
    height: "87%",
    padding: space.bgPadding,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: scale(20),
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  },

  activityItemName: {
    ...defaultText,
    maxWidth: "70%",
  },
  activityItemTime: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  activityItemTimeIcon: {
    fontSize: fontSize.size24,
    color: color.grey,
  },
  activityItemTimeText: {
    ...defaultText,
    maxWidth: scale(120),
    fontSize: fontSize.size22,
    color: color.grey,
    marginRight: space.itemMargin,
  },
  activityButtonBox: {
    backgroundColor: color.background,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  activityButton: {
    marginVertical: scale(10),
    marginHorizontal: scale(30),
    flexDirection: "row",
    alignItems: "center",
  },
  activityButtonText: {
    ...defaultText,
    color: "#fff",
  },
  activityButtonIcon: {
    color: "#fff",
    fontSize: fontSize.size24,
    marginRight: scale(10),
  },
  //#endregion

  actionButton: { ...shadow },
  actionButtonIcon: {
    fontSize: 25,
    color: "#fff",
  },
  dot: {
    width: scale(15),
    height: scale(15),
    backgroundColor: color.hint,
    borderRadius: scale(8),
    marginRight: scale(15),
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
