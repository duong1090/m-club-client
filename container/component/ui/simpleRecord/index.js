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

        <View style={styles.content}>
          {header ? header(data) : null}
          <View>
            {fields && fields.length
              ? fields.map((item, index) => (
                  <InputItem
                    type={item.type ? item.type : null}
                    key={index}
                    style={styles.inputField}
                    label={item.name}
                    required={item.required ? item.required : false}
                    placeholder={item.placeholder ? item.placeholder : null}
                    onPress={item.onPress ? item.onPress : null}
                    onChangeText={item.onChangeText ? item.onChangeText : null}
                    onChangeDate={item.onChangeDate ? item.onChangeDate : null}
                    value={
                      data && data[item.fieldName] ? data[item.fieldName] : null
                    }
                    mode={item.mode ? item.mode : null}
                    modalObj={item.modalObj ? item.modalObj : null}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
    height: "100%",
  },
  content: {
    padding: space.bgPadding,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: space.border,
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
    width: "100%",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(20),
  },
  titleSymbol: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
  inputField: {
    marginBottom: space.componentMargin,
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
    borderColor: color.text,
    backgroundColor: color.primary,
    paddingHorizontal: scale(20),
    paddingVertical: scale(5),
    borderRadius: space.border,
  },
  backText: {
    ...defaultText,
    fontSize: fontSize.size28,
    color: "#fff",
    marginLeft: scale(5),
  },
  backIcon: {
    fontSize: scale(25),
    color: "#fff",
  },
});

export default injectIntl(SimpleRecord);
