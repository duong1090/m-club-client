import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  shadow,
} from "container/variables/common";

export const ICON_BOX_SIZE = scale(50);
export const ICON_SIZE = scale(30);
export const AVATAR_SIZE = scale(130);

export const styles = StyleSheet.create({
  container: { flex: 1 },

  item: (isRead) => ({
    backgroundColor: isRead ? "#fff" : color.notification.unread,
    flexDirection: "row",
    alignItems: "center",
    padding: scale(20),
  }),

  avatarBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIconBox: (type, options) => {
    let backgroundColor = color.success;

    switch (type) {
      case "task":
        if (options && options.noti_color)
          backgroundColor = color.notification[options.noti_color];
        break;
    }

    return {
      position: "absolute",
      width: ICON_BOX_SIZE,
      height: ICON_BOX_SIZE,
      borderRadius: ICON_BOX_SIZE / 2,
      bottom: 0,
      right: scale(-5),
      backgroundColor,
      ...shadow,
      elevation: 4,
    };
  },
  avatarIconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  avatarIconBackground: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  contentBox: { flex: 1, marginLeft: space.componentMargin },
  content: {
    fontSize: fontSize.sizeTitle,
  },
  timeText: {
    fontSize: fontSize.sizeContent,
    color: color.grey,
    marginTop: scale(5),
  },
  emptyBox: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.sizeBigContent,
  },
  headerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: space.bgPadding,
    paddingVertical: space.bgPadding / 2,
  },
  headerText: {
    fontSize: fontSize.size36,
    fontWeight: "bold",
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
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
  listContainer: {
    paddingBottom: scale(70),
  },
});
