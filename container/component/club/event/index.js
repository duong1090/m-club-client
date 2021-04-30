import { ScrollableTab, Tab, Tabs } from "native-base";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import List from "./component/list";
import { modeState } from "./recoil";
import { useRecoilValue } from "recoil";

const Event = (props) => {
  //props
  const { componentId, intl } = props;

  //state
  // const [mode, setMode] = useState("list");

  //variables

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.event),
      },
    },
  });

  //render -------------------------------------------------------------------------------------------------------
  
  return (
    <View style={{ height: "100%" }}>
      <List />
    </View>
  );
};

export default injectIntl(Event);

const styles = StyleSheet.create({});
