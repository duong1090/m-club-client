import React from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { Icon, Content, Container } from "native-base";
import InputItem from "container/component/ui/inputItem";

const SimpleRecord = (props) => {
  const { mode, intl, header, data, fields, onSubmit, backButton } = props;

  console.log("SimpleRecord:::", data);

  //render
  return (
    <ScrollView style={styles.container}>
      {backButton ? (
        <TouchableOpacity
          onPress={() => backButton.onPress()}
          style={styles.backButton}
        >
          <Icon name="caret-back" style={styles.backIcon} />
          <Text style={styles.backText}>{backButton.title}</Text>
        </TouchableOpacity>
      ) : null}

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
            ? fields.map((item, index) => (
                <InputItem
                  type={item.type ? item.type : null}
                  key={index}
                  style={styles.inputField}
                  onPress={item.onPress ? item.onPress : null}
                  label={item.name}
                  required={item.required ? item.required : false}
                  placeholder={item.placeholder ? item.placeholder : null}
                  onChangeText={item.onChangeText ? item.onChangeText : null}
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
    </ScrollView>
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
    marginBottom: space.bgPadding * 2,
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
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: space.itemMargin,
    borderBottomWidth: scale(2),
    borderColor: color.text,
  },
  backText: {
    ...defaultText,
    fontSize: fontSize.size28,
    color: color.text,
    marginLeft: scale(5),
  },
  backIcon: {
    fontSize: scale(25),
    color: color.text,
  },
});

export default injectIntl(SimpleRecord);
