import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, Tab, ScrollableTab } from "native-base";
import List from "./component/list";
import Detail from "./component/detail";
import Record from "./component/record";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { currModeState } from "./recoil";
import { useRecoilState } from "recoil";

const Member = (props) => {
  //props
  const { componentId, intl } = props;

  //state
  const [currMode, setCurrMode] = useRecoilState(currModeState);

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.member),
      },
    },
  });

  //screens
  const tabs = [
    { key: "list", render: <List /> },
    { key: "detail", render: <Detail /> },
    { key: "edit", render: <Record /> },
    { key: "create", render: <Record /> },
  ];

  //render
  const renderMode = () => {
    const activeTab = tabs.findIndex((item) => item.key == currMode);

    console.log("renderMode::::", activeTab, currMode);

    return (
      <Tabs
        initialPage={0}
        page={activeTab}
        locked
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, marginTop: -2 }} />
        )}
      >
        {tabs.map((tab) => (
          <Tab heading="" style={{ backgroundColor: "transparent" }}>
            {tab.render}
          </Tab>
        ))}
      </Tabs>
    );
  };

  return <View style={styles.container}>{renderMode()}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default injectIntl(Member);
