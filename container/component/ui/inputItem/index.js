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
  Keyboard,
} from "react-native";
import { color, scale, fontSize, space } from "container/variables/common";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { Icon, Textarea } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SelectModal from "container/component/ui/selectModal";
import { reduce } from "lodash";

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
    required,
    mode,
    onChangeDate,
    modalObj,
    rowSpan,
    formatValue,
    note,
  } = props;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  //state
  const [visible, setVisible] = useState(false);

  // useImperativeHandle(ref, () => ({
  //   inputRef,
  // }));

  const replaceSpace = (str) => {
    return str.replace(/\u0020/, "\u00a0");
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
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
          keyboardType={keyboardType ? keyboardType : "numeric"}
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

  const formatterValue = (value) => {
    return formatValue
      ? moment(value.name || value.title || value || "").format(formatValue)
      : value.name || value.title || value || "";
  };

  const renderButton = () => {
    const { selectedData } = modalObj || {};

    console.log("");

    //transform value to show
    const transformValue = value
      ? Array.isArray(value)
        ? value.reduce((str, item, index) => {
            const title = formatterValue(item);

            if (index > 0) str += `, ${title}`;
            else str += title;

            return str;
          }, "")
        : formatterValue(value)
      : null;

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          modalRef && modalRef.current.show();
        }}
      >
        <View style={[styles.wrapButton, inputStyle]}>
          {transformValue ? (
            <Text numberOfLines={1} ellipsizeMode={"tail"}>
              {transformValue}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: fontSize.size28,
                color: color.hint,
              }}
            >
              {placeholder ? placeholder : intl.formatMessage(Messages.select)}
            </Text>
          )}
          {!noIcon ? (
            <Icon
              name="caret-forward"
              style={{ color: color.hint, fontSize: scale(40) }}
            />
          ) : null}
          <SelectModal
            ref={modalRef}
            {...modalObj}
            selectedData={value ? value : selectedData}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateTimePicker = () => {
    return (
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center" }}
        onPress={() => setVisible(true)}
      >
        {value ? (
          <Text numberOfLines={1} ellipsizeMode={"tail"}>
            {value}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: fontSize.size28,
              color: color.hint,
            }}
          >
            {placeholder ? placeholder : intl.formatMessage(Messages.select)}
          </Text>
        )}
        <DateTimePickerModal
          isVisible={visible}
          mode={mode ? mode : "date"}
          onConfirm={(date) => {
            setVisible(false);
            onChangeDate(date);
          }}
          date={
            new Date(
              Date.parse(
                value
                  ? moment(
                      value,
                      intl.formatMessage(Messages.date_format)
                    ).format("YYYY-MM-DD")
                  : moment().format("YYYY-MM-DD")
              )
            )
          }
          onCancel={() => setVisible(false)}
        />
      </TouchableOpacity>
    );
  };

  const renderTextArea = () => {
    return (
      <Textarea
        style={[styles.textAreaInput, inputStyle]}
        rowSpan={rowSpan ? rowSpan : 5}
        placeholder={placeholder ? placeholder : ""}
        placeholderTextColor={color.hint}
        onChangeText={onChange}
        value={value}
        autoCorrect={autoCorrect}
      />
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
      case "date_picker":
        return renderDateTimePicker();
        break;
      case "text_area":
        return renderTextArea();
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
      <View style={styles.card(type)}>{renderItem()}</View>
      {note ? <Text style={styles.textNote}>{note}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: (type) => {
    let style = {
      justifyContent: "center",
      backgroundColor: color.input,
      borderRadius: space.border,
      paddingHorizontal: scale(30),
      paddingVertical: scale(10),
    };
    if (type != "text_area") style.height = scale(80);
    return style;
  },
  textInput: {
    flex: 1,
    fontSize: fontSize.size28,
    color: color.text,
    minHeight: scale(80),
  },

  otpInput: {
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
  textAreaInput: {
    fontSize: fontSize.size28,
    paddingLeft: 0,
    paddingRight: 0,
    color: color.text,
  },
  textNote: {
    fontSize: fontSize.size26,
    color: color.grey,
    fontStyle: "italic",
    marginLeft: scale(30),
    marginTop: scale(5),
  },
});

const intlComponent = injectIntl(InputItem);

export default forwardRef(intlComponent);
