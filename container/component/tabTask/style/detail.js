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
    padding: space.bgPadding,
  },
  contentBtnDone: (isDone) => ({
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: space.itemMargin,
    marginBottom: space.itemMargin,
    backgroundColor: isDone ? color.success : color.lightGrey,
    borderRadius: space.border,
  }),
  textDone: (isDone) => ({
    ...defaultText,
    color: isDone ? "#fff" : color.text,
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
    ...defaultText,
    color: "#fff",
  },
  contentBtnDelete: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: space.itemMargin,
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
    ...defaultText,
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
    ...defaultText,
    fontWeight: "bold",
    marginRight: space.componentMargin,
  },
  contentDeadlineBox: {
    borderColor: color.danger,
    paddingVertical: scale(10),
  },
  contentDeadlineTime: (deadline) => ({
    ...defaultText,
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
    ...defaultText,
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
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.size22,
  },
  contentLabelDetail: {
    ...defaultText,
    color: color.grey,
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
    marginBottom: space.componentMargin,
    paddingBottom: space.bgPadding * 2,
    backgroundColor: color.backgroundColor,
  },
  childrenHeader: {
    flexDirection: "row",
    margin: space.componentMargin,

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
    marginTop: 0,
    margin: space.componentMargin,
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
