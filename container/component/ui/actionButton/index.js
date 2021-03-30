import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  scale,
  color,
  shadow,
  defaultText,
  space,
} from "container/variables/common";

const ActionButton = (props) => {
  const { title, icon, style, color, fontColor, fontStyle, onPress } = props;

  return (
    <View style={[styles.actionButtonBox, style]}>
      <TouchableOpacity style={styles.actionButton(color)} onPress={onPress}>
        {icon ? icon : null}
        <Text style={[styles.actionButtonText(fontColor), fontStyle]}>
          {title ? title : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scale(15),
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: (btnColor) => ({
    backgroundColor: btnColor ? btnColor : color.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: space.border,
    ...shadow,
  }),
  actionButtonText: (fontColor) => ({
    ...defaultText,
    color: fontColor ? fontColor : "#fff",
  }),
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
});

export default ActionButton;
