import React from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
  const { mode, intl, header, data, fields } = props;

  //render
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.symbol}>
          <Icon
            type="MaterialCommunityIcons"
            name="pencil"
            style={style.iconSymbol}
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
                  label={item.fieldName}
                  placeholder={item.placeholder ? item.placeholder : null}
                  onChangeText={item.onChangeText}
                  value={
                    data && data[item.fieldName] ? data[item.fieldName] : null
                  }
                />
              ))
            : null}
        </View>
        <TouchableOpacity style={styles.doneBox}>
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
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    padding: space.bgPadding,
    ...shadow,
  },
  iconSymbol: {
    color: "#fff",
    fontSize: scale(50),
    alignItems: "center",
    marginRight: space.componentMargin,
  },
  symbol: {
    padding: scale(15),
    borderRadius: space.border,
    backgroundColor: color.background,
  },
  titleSymbol: {
    ...defaultText,
    color: "#fff",
  },
  inputField: {
    marginBottom: space.componentMargin,
  },
  doneBox: {
    padding: scale(15),
    backgroundColor: color.warning,
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
});

export default injectIntl(SimpleRecord);
