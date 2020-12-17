import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  StyleSheet,
  View,
  TextInput,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  color,
  scale,
  fontSize,
  defaultText,
  space,
} from "container/variables/common";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { Icon } from "native-base";

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
    label,
    intl,
    noIcon,
    onPress,
    required,
  } = props;
  const inputRef = useRef(null);

  // useImperativeHandle(ref, () => ({
  //   inputRef,
  // }));

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
              ...defaultText,
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

  const renderInput = () => {
    return (
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        type="number"
        placeholderTextColor={color.hint}
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
    );
  };

  const renderButton = () => {
    console.log("renderButton:::", value);

    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <View style={[styles.wrapButton, inputStyle]}>
          {value ? (
            <Text
              style={{ ...defaultText }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {value.name || value.title || ""}
            </Text>
          ) : (
            <Text
              style={{
                ...defaultText,
                fontSize: fontSize.size28,
                color: color.hint,
              }}
            >
              {placeholder ? placeholder : intl.formatMessage(Messages.select)}
            </Text>
          )}
          {!noIcon ? (
            <Icon
              name="caret-down"
              style={{ color: color.hint, fontSize: scale(40) }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = () => {
    switch (type) {
      case "otp":
        return renderOTPInput();
        break;
      case "button":
        return renderButton();
        break;
      default:
        return renderInput();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <View style={styles.label}>
          <Text style={styles.textLabel}>{label}</Text>
          {required ? <View style={styles.dot} /> : null}
        </View>
      ) : null}
      <View style={styles.card}>{renderItem()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    justifyContent: "center",
    height: scale(80),
    backgroundColor: "#F5EDF6",
    borderRadius: scale(50),
    paddingHorizontal: scale(30),
    paddingVertical: scale(10),
  },
  textInput: {
    ...defaultText,
    flex: 1,
    fontSize: fontSize.size28,
    color: color.text,
    minHeight: scale(80),
  },

  otpInput: {
    ...defaultText,
    width: "80%",
    fontSize: fontSize.size28,
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

  textLabel: {
    ...defaultText,
    fontSize: fontSize.size28,
    fontWeight: "bold",
    marginLeft: scale(30),
    marginBottom: scale(5),
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  dot: {
    width: scale(15),
    height: scale(15),
    backgroundColor: color.danger,
    borderRadius: scale(8),
    marginLeft: scale(10),
  },
});

const intlComponent = injectIntl(InputItem);

export default forwardRef(intlComponent);
