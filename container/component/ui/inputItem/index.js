import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import { StyleSheet, View, TextInput, Platform } from "react-native";
import { color, scale, fontSize } from "container/variables/common";

const InputItem = (props, ref) => {
  const {
    style,
    placeholder,
    value,
    disabled,
    onFocus,
    onBlur,
    autoCorrect,
    inputStyle,
    textAlign,
    keyboardType,
    maxLength,
    onChangeText,
  } = props;
  const inputRef = useRef(null);

  const replaceSpace = (str) => {
    return str.replace(/\u0020/, "\u00a0");
  };

  const onChange = (text) => {
    if (keyboardType === "numeric" || keyboardType === "decimal-pad") {
      let last = text.length - 1;
      let newText = text;
      if (text[last] === ",") {
        newText = newText.substring(0, last) + ".";
      }
      newText = newText.replace(/[\,\s\-]/g, "");
      if (onChangeText) {
        onChangeText(newText);
      }
      return;
    }
    var editedText;

    if (Platform.OS === "ios") {
      editedText = replaceSpace(text);
    } else {
      editedText = text;
    }

    if (onChangeText) {
      onChangeText(editedText);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        style={[styles.textInput, inputStyle]}
        editable={!disabled}
        onBlur={onBlur ? onBlur : null}
        onFocus={onFocus ? onFocus : null}
        autoCorrect={autoCorrect}
        textAlign={textAlign ? textAlign : null}
        keyboardType={keyboardType ? keyboardType : null}
        maxLength={maxLength}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: scale(80),
    backgroundColor: "#F5EDF6",
    borderRadius: scale(50),
    paddingHorizontal: scale(30),
    paddingVertical: scale(10),
  },
  textInput: {
    flex: 1,
    fontSize: fontSize.size28,
    // fontFamily: "Roboto-Regular",
    color: color.fontColor,
    minHeight: scale(80),
  },
});

export default forwardRef(InputItem);
