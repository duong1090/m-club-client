import { StyleSheet } from "react-native";
import {
  scale,
  color,
  shadow,
  space,
  
} from "container/variables/common";

export const AVATAR_SIZE = scale(60);

export const styles = StyleSheet.create({
  taskTypeWrapper: {
    flexDirection: "row",
    marginBottom: space.bgPadding,
    alignItems: "center",
  },
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignWrap: {
    flexDirection: "row",
    height: "100%",
    width: "28%",
  },
  dueDateWrap: {
    marginLeft: scale(50),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    flex: 1,
    paddingVertical: space.itemMargin,
    paddingHorizontal: space.componentMargin,
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    
    color: "#fff",
  },
  avatarBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  avatar: {
    position: "absolute",
    top: -AVATAR_SIZE / 2,
  },
  moreAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    ...shadow,
  },
  textMoreAvatar: {
    
    fontWeight: "bold",
    color: "#fff",
  },
  assignedName: {
    
    maxWidth: "75%",
    fontWeight: "bold",
    marginLeft: space.itemMargin,
  },
  byObjBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: space.itemMargin,
  },
  byObjDot: {
    width: scale(20),
    aspectRatio: 1,
    borderRadius: scale(10),
    backgroundColor: color.success,
    marginRight: scale(10),
  },
  byObjText: {
    
  },
});
