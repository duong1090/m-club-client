import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text } from "native-base";
import { color, scale } from "container/variables/common";

const RadioButton = (props) => {
  const { style } = props;

  //render
  return (
    <TouchableOpacity
      onPress={props.onChange}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: scale(40),
          width: scale(40),
          borderColor: props.selected ? color.done : color.grey,
          borderRadius: scale(20),
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "transparent",
          ...style,
        }}
      >
        {props.selected ? (
          <View
            style={{
              height: scale(25),
              width: scale(25),
              borderRadius: scale(13),
              backgroundColor: color.done,
            }}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
