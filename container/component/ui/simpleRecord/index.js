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
  
} from "container/variables/common";
import { Icon } from "native-base";
import InputItem from "container/component/ui/inputItem";
import Toast from "react-native-simple-toast";

const SimpleRecord = (props) => {
  const { mode, intl, header, data, fields, onSubmit, backButton } = props;

  console.log("SimpleRecord:::", data);

  //function -----------------------------------------------------------------------------------------

  const preValidate = () => {
    const notFillRequired =
      fields.findIndex((item) => item.required && !data[item.fieldName]) >= 0
        ? true
        : false;

    if (notFillRequired)
      Toast.show(intl.formatMessage(Messages.pls_fill_required), Toast.LONG);
    else onSubmit();
  };

  //render -------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.actionBox}>
        {backButton ? (
          <TouchableOpacity
            onPress={() => backButton.onPress()}
            style={styles.backButton}
          >
            <Icon
              name="chevron-back"
              style={[styles.backIcon, { fontSize: scale(40) }]}
            />
            <Text style={styles.backText}>{backButton.title}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => preValidate()}
          style={styles.backButton}
        >
          <Icon name="check" type="Feather" style={styles.backIcon} />
          <Text style={styles.backText}>
            {intl.formatMessage(Messages.done)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.symbol}>
          <Icon type="Entypo" name="edit" style={styles.iconSymbol} />
          {mode === "edit" ? (
            <Text style={styles.titleSymbol}>
              {intl.formatMessage(Messages.edit)}
            </Text>
          ) : mode === "create" ? (
            <Text style={styles.titleSymbol}>
              {intl.formatMessage(Messages.add)}
            </Text>
          ) : null}
        </View>

        <ScrollView style={styles.content}>
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
                    keyboardType={item.keyboardType ? item.keyboardType : null}
                    value={
                      data && data[item.fieldName] ? data[item.fieldName] : null
                    }
                    mode={item.mode ? item.mode : null}
                    modalObj={item.modalObj ? item.modalObj : null}
                  />
                ))
              : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  content: {
    padding: space.bgPadding,
    flex: 1,
  },
  card: {
    flex: 1,
  },
  iconSymbol: {
    fontSize: scale(39),
    alignItems: "center",
    marginRight: scale(10),
  },
  symbol: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    backgroundColor: color.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(20),
  },
  titleSymbol: {
    
    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
  inputField: {
    marginBottom: space.componentMargin,
  },
  doneBox: {
    paddingVertical: space.itemMargin,
    paddingHorizontal: space.bgPadding,
    marginTop: space.componentMargin,
    backgroundColor: color.warning,
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: fontSize.size28,
    color: "#fff",
    marginLeft: scale(5),
  },
  backIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: color.grey,
    paddingHorizontal: space.componentMargin / 2,
    paddingVertical: scale(20),
  },
});

export default injectIntl(SimpleRecord);
