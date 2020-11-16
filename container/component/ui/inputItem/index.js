import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import { StyleSheet, View, TextInput, Platform, Text } from "react-native";
import { color, scale, fontSize } from "container/variables/common";

const InputItem = (props, ref) => {
  const {
    type,
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

  const renderOTPInput = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: scale(30),
        }}
      >
        {placeholder ? (
          <Text
            style={{
              fontSize: fontSize.size28,
              color: color.fontColor,
              marginRight: scale(15),
              fontWeight: "bold",
            }}
          >
            {placeholder}
          </Text>
        ) : null}
        <TextInput
          ref={inputRef}
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

  return (
    <View style={[styles.container, style]}>
      {type == "otp" ? (
        renderOTPInput()
      ) : (
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          type="number"
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
      )}
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

  otpInput: {
    width: "80%",
    fontSize: fontSize.size28,
    // fontFamily: "Roboto-Regular",
    color: "#000",
    minHeight: scale(80),
  },

  underlineStyleBase: {
    width: scale(50),
    height: scale(100),
    borderWidth: 0,
    borderBottomWidth: scale(2),
  },

  underlineStyleHighLighted: {
    borderColor: "#000",
  },
});

export default forwardRef(InputItem);
