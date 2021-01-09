import React from "react";
import { StyleSheet, View } from "react-native";
import FundList from "./list";
import Messages from "container/translation/Message";
import { color } from "container/variables/common";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";

const Funds = (props) => {
  const { componentId, intl } = props;


  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.funds),
      },
    },
  });

  return (
    <View style={styles.container}>
      <FundList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: color.backgroundColor,
  },
});

export default injectIntl(Funds);
