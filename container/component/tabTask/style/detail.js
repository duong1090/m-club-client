import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import { Platform, StyleSheet } from "react-native";

export const AVATAR_SIZE = scale(60);
export const styles = StyleSheet.create({
  container: {},
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
    fontStyle: "italic",
    fontSize: fontSize.size20,
  },
  contentChildTask: {
    fontSize: fontSize.size22,
    fontStyle: "italic",
    fontWeight: "bold",
    color: color.primary,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.itemMargin,
  },
  contentAction: {
    padding: space.bgPadding,
  },
  contentBtnDone: (isDone) => ({
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: space.itemMargin,
    marginBottom: space.itemMargin,
    backgroundColor: isDone ? color.success : color.lightGreyPlus,
    borderRadius: space.border,
  }),
  textDone: (isDone) => ({
    color: isDone ? "#fff" : color.grey,
  }),
  contentDoneIcon: {
    color: "#fff",
    fontSize: scale(30),
    position: "absolute",
    right: space.componentMargin,
    top: space.itemMargin,
    bottom: space.itemMargin,
  },

  textDelete: {
    color: color.danger,
  },
  contentBtnDelete: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: space.itemMargin,
    borderRadius: space.border,
    borderWidth: scale(1),
    borderStyle: "dashed",
    borderColor: color.danger,
  },
  contentDeleteIcon: {
    fontSize: scale(30),
    marginLeft: scale(10),
    color: color.danger,
  },
  contentTitle: {
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
    marginLeft: Platform.OS == "ios" ? scale(4) : 0,
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
    fontWeight: "bold",
    color: "#fff",
  },
  contentMemName: {
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
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentPriorityBox: (level) => ({
    backgroundColor: [color.lightGrey, color.green, color.orange, color.red][
      level
    ],
    paddingHorizontal: scale(30),
    paddingVertical: scale(10),
    borderRadius: space.border,
    borderStyle: level == 0 ? "dashed" : "solid",
    borderWidth: level == 0 ? scale(2) : 0,
    borderColor: color.grey,
  }),
  contentPriorityLevel: (level) => ({
    color: level == 0 ? color.grey : "#fff",
  }),
  contentDeadline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    borderBottomWidth: scale(2),
    borderColor: color.hint,
  },
  contentDeadlineText: {
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentDeadlineBox: {
    borderColor: color.danger,
    paddingVertical: scale(10),
  },
  contentDeadlineTime: (deadline) => ({
    color: deadline ? color.danger : color.grey,
    fontSize: fontSize.size24,
  }),
  contentLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
  },
  contentLabelText: {
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentLabelBox: {
    paddingVertical: scale(10),
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  labelBox: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: scale(-5),
  },
  labelItem: (color) => ({
    borderRadius: space.border,
    backgroundColor: color,
    paddingHorizontal: space.itemMargin,
    paddingVertical: scale(10),
    margin: scale(5),
  }),
  labelItemText: {
    color: "#fff",
    fontSize: fontSize.size22,
  },
  contentLabelDetail: {
    color: color.grey,
    fontSize: fontSize.size24,
  },
  contentDescriptionBox: {
    marginTop: space.componentMargin,
    flexDirection: "row",
    alignItems: "center",
  },
  contentDescriptionText: {
    flex: 1,
  },

  //#endregion

  //#region children
  children: {
    marginBottom: space.componentMargin,
    backgroundColor: color.backgroundColor,
  },
  childrenHeader: {
    flexDirection: "row",
    margin: space.componentMargin,
    marginBottom: 0,
    justifyContent: "space-between",
  },
  childrenTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.componentMargin,
  },
  childrenTitle: {
    fontWeight: "bold",
  },
  childrenCreateIcon: {
    fontSize: fontSize.size24,
    color: color.primary,
    marginLeft: scale(10),
  },
  childrenCreateText: {
    color: color.primary,
  },

  childrenEmpty: {
    justifyContent: "center",
    alignItems: "center",
    padding: space.componentMargin,
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
    marginLeft: Platform.OS == "ios" ? scale(2) : 0,
  },

  childrenItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(20),
    paddingVertical: scale(10),
    borderColor: color.lightGrey,
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
    fontSize: scale(50),
    color: isDone ? color.green : color.grey,
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
  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalBody: {
    height: "85%",
    backgroundColor: "#fff",
    paddingTop: space.componentMargin,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
  },
});
