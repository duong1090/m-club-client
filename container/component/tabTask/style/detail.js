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
  },
  contentBody: {
    borderRadius: space.border,
    backgroundColor: color.backgroundColor,
  },
  contentChild: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
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
  },
  contentAction: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: space.bgPadding,
  },
  contentBtnDone: (isDone) => ({
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    backgroundColor: isDone ? color.success : "#fff",
    borderRadius: space.border,
  }),
  textDone: (isDone) => ({
    color: isDone ? "#fff" : color.text,
  }),
  contentDoneIcon: (isDone) => ({
    color: isDone ? "#fff" : color.text,
    fontSize: scale(30),
    marginLeft: scale(10),
  }),

  textDelete: {
    color: "#fff",
  },
  contentBtnDelete: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    backgroundColor: color.red,
    borderRadius: space.border,
  },
  contentDeleteIcon: {
    fontSize: scale(30),
    marginLeft: scale(10),
    color: "#fff",
  },
  contentTitle: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    flex: 1,
  },
  contentTitleIcon: {
    fontSize: fontSize.size24,
    color: color.primary,
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
    justifyContent: "flex-end",
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
    backgroundColor: ["transparent", color.green, color.orange, color.red][
      level
    ],
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
  contentDescriptionBox: {
    marginTop: space.componentMargin,
    flexDirection: "row",
    alignItems: "center",
  },
  contentDescriptionText: {
    ...defaultText,
    flex: 1,
  },

  //#endregion

  //#region children
  children: {
    padding: space.bgPadding,
    marginBottom: space.componentMargin,
    backgroundColor: "#ddd",
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
    marginLeft: scale(10),
  },
  childrenCreateText: {
    ...defaultText,
    color: color.primary,
  },

  childrenEmpty: {
    justifyContent: "center",
    alignItems: "center",
  },

  childrenEmptyButton: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(50),
    borderWidth: scale(2),
    borderColor: color.grey,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(10),
  },

  childrenEmptyText: {
    color: color.grey,
  },

  childrenEmptyIcon: {
    color: color.grey,
    fontSize: scale(50),
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
    flex: 1,
  },
  activityItemTime: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "flex-end",
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
    textAlign: "right",
  },
  activityButtonBox: {
    backgroundColor: color.background,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  activityButton: {
    marginVertical: scale(15),
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
  editBox: {
    width: scale(24),
    height: scale(24),
  },
});
