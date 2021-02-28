import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, Tab, ScrollableTab } from "native-base";
import List from "./list";
import Detail from "./detail";
import Record from "./record";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";

const Department = (props) => {
  //props
  const { componentId, intl } = props;

  //state
  const [mode, setMode] = useState("list");

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.department),
      },
    },
  });

  //change mode to switch screen
  const onChangeMode = (mode = "list") => {
    setMode(mode);
  };

  //screens
  const tabs = [
    { key: "list", render: <List changeMode={onChangeMode} mode={mode} /> },
    { key: "detail", render: <Detail changeMode={onChangeMode} mode={mode} /> },
    { key: "edit", render: <Record changeMode={onChangeMode} mode={mode} /> },
    { key: "create", render: <Record changeMode={onChangeMode} mode={mode} /> },
  ];

  //render
  const renderMode = (mode) => {
    const activeTab = tabs.findIndex((item) => item.key == mode);

    return (
      <Tabs
        initialPage={0}
        page={activeTab}
        locked
        onChangeTab={(e) => {
          setMode(tabs[e.i].key);
        }}
        renderTabBar={() => <ScrollableTab style={{ height: 0 }} />}
      >
        {tabs.map((tab) => (
          <Tab heading="" style={{ backgroundColor: "transparent" }}>
            {tab.render}
          </Tab>
        ))}
      </Tabs>
    );
  };

  return <View style={styles.container}>{renderMode(mode)}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default injectIntl(Department);
