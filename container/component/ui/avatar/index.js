import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  defaultText,
} from "container/variables/common";

import { useRecoilValue } from "recoil";
import { userState } from "container/recoil/state/user";

const Avatar = (props) => {
  //props
  const { style, size } = props;

  //recoil
  const user = useRecoilValue(userState);

  const name = user && user.name ? user.name[0].toUpperCase() : "";

  return (
    <View
      style={[
        styles.container,
        style,
        size ? { width: size, height: size } : null,
      ]}
    >
      <Text
        style={[
          styles.text,
          size ? { width: 0.6 * size, height: 0.6 * size } : null,
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: scale(2),
    backgroundColor: color.background,
  },
  text: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.size40,
  },
});

export default Avatar;
