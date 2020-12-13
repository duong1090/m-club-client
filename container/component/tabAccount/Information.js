import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";

const Information = (props) => {
  //props
  const { style } = props;

  return (
    <View style={[styles.container, style]}>
      <Avatar size={scale(200)} />
      <View style={styles.info}>
        <Text style={styles.name}>Nguyen Van A</Text>
        <Text style={styles.position}>Leader</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: space.bgPadding,
    borderRadius: scale(20),
    alignItems: "center",
    ...shadow,
  },
  info: {
    marginLeft: scale(40),
  },
  name: {
    ...defaultText,
    fontSize: fontSize.size36,
    fontWeight: "bold",
  },
  position: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent,
  },
});

export default Information;
