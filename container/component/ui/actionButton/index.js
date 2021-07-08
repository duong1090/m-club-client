import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  scale,
  color,
  shadow,
  
  space,
} from "container/variables/common";
import { elevation } from "../../../constant/screen";

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
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    borderRadius: space.border,
    ...shadow,
    elevation: 0,
  }),
  actionButtonText: (fontColor) => ({
    
    color: fontColor ? fontColor : "#fff",
  }),
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
});

export default ActionButton;
