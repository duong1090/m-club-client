import { StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
  shadow,
} from "container/variables/common";

export const ICON_BOX_SIZE = scale(50);
export const ICON_SIZE = scale(30);
export const AVATAR_SIZE = scale(130);

export const styles = StyleSheet.create({
  container: { flex: 1 },

  item: (isRead) => ({
    backgroundColor: isRead ? "#fff" : color.unread,
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
        if (options)
          backgroundColor = [color.green, color.orange, color.red][
            options.prior_level
          ];
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
    ...defaultText,
    fontSize: fontSize.sizeContent,
  },
  timeText: {
    ...defaultText,
    fontSize: fontSize.size22,
    color: color.grey,
    marginTop: scale(5),
  },
});
