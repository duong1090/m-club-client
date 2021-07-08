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
          borderColor: props.selected ? color.blue : color.grey,
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
              height: scale(22),
              width: scale(22),
              borderRadius: scale(11),
              backgroundColor: color.blue,
            }}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
