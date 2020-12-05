import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";

const ManageItem = (props) => {
  //props
  const { style, data, onPress } = props;

  const title = data.title ? data.title : "";

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={styles.icon}></View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: scale(20),
    padding: space.bgPadding,
    marginBottom: space.componentMargin,
    ...shadow,
  },
  icon: {
    width: "20%",
    aspectRatio: 1,
    borderWidth: scale(2),
  },
  title: {
    ...defaultText,
    fontSize: fontSize.size30,
  },
});

export default ManageItem;
