import React from "react";
import {
  color,
  scale,
  fontSize,
  defaultText,
} from "container/variables/common";
import { View, StyleSheet, TextInput } from "react-native";
import { Icon } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";

const SearchBox = (props) => {
  const { onSearch, placeholder, style, intl } = props;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchBox}>
        <Icon type="Entypo" name="magnifying-glass" style={styles.icon} />
        <TextInput
          styles={styles.text}
          placeholder={
            placeholder
              ? placeholder
              : intl.formatMessage(Messages.search_placeholder)
          }
          onChangeText={(text) => onSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
  },
  text: {
    ...defaultText,
    fontSize: fontSize.sizeContent,
  },
  searchBox: {
    backgroundColor: color.backgroundColor,
    borderRadius: scale(20),
    padding: scale(5),
    height: scale(80),
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: scale(40),
    marginHorizontal: scale(10),
    color: color.hint,
  },
});

export default injectIntl(SearchBox);
