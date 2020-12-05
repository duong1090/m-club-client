import React from "react";
import { injectIntl } from "react-intl";
import { View, StyleSheet } from "react-native";
import SimpleDetail from "container/component/ui/simpleDetail";

const MemberDetail = (props) => {
  const { componentId, intl } = props;

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.member),
      },
    },
  });

  //render
  return <View style={styles.container}>
    <SimpleDetail />
  </View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default injectIntl(MemberDetail);
