import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import {
  scale,
  fontSize,
  defaultText,
  color,
} from "container/variables/common";

const EmptyData = (props) => {
  const { intl } = props;

  return (
    <View style={styles.boxEmpty}>
      <Image
        style={styles.image}
        source={require("container/asset/image/empty-data.png")}
      />
      <Text style={styles.textEmpty}>
        {intl.formatMessage(Messages.empty_data)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxEmpty: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    marginTop: scale(10),
    ...defaultText,
    color: color.lightGrey,
    fontSize: fontSize.sizeBigContent,
  },
  image: {
    width: scale(300),
    height: scale(300),
    resizeMode: "contain",
  },
});

export default injectIntl(EmptyData);
