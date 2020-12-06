import React from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { Icon } from "native-base";
import InputItem from "container/component/ui/inputItem";

const SimpleRecord = (props) => {
  const { mode, intl, header, data, fields, onSubmit } = props;

  //render
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.symbol}>
          <Icon
            type="MaterialCommunityIcons"
            name="pencil"
            style={styles.iconSymbol}
          />
          {mode === "edit" ? (
            <Text style={styles.titleSymbol}>
              {intl.formatMessage(Messages.edit)}
            </Text>
          ) : mode === "create" ? (
            <Text style={styles.titleSymbol}>
              {intl.formatMessage(Messages.create)}
            </Text>
          ) : null}
        </View>
        {header ? header(data) : null}
        <View>
          {fields && fields.length
            ? fields.map((item) => (
                <InputItem
                  style={styles.inputField}
                  label={item.name}
                  required={item.required ? item.required : false}
                  placeholder={item.placeholder ? item.placeholder : null}
                  onChangeText={item.onChangeText}
                  value={
                    data && data[item.fieldName] ? data[item.fieldName] : null
                  }
                />
              ))
            : null}
        </View>
        <TouchableOpacity style={styles.doneBox} onPress={onSubmit}>
          <Text style={styles.titleSymbol}>
            {intl.formatMessage(Messages.done)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
    height: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    padding: space.bgPadding,
    ...shadow,
  },
  iconSymbol: {
    color: "#fff",
    fontSize: scale(39),
    alignItems: "center",
    marginRight: scale(10),
  },
  symbol: {
    flexDirection: "row",
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(40),
    backgroundColor: color.background,
    alignSelf: "flex-start",
    alignItems: "center",
    marginBottom: scale(60),
  },
  titleSymbol: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
  inputField: {
    marginBottom: scale(60),
  },
  doneBox: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    backgroundColor: color.warning,
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    ...shadow,
  },
});

export default injectIntl(SimpleRecord);
