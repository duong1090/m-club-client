import React, { useState } from "react";
import { Tabs, Tab, ScrollableTab } from "native-base";
import { StyleSheet, View } from "react-native";
import ItemPicker from "./component/itemPicker";
import RoleList from "./component/roleList";
import TypeList from "./component/typeList";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { color } from "container/variables/common";
import { useRecoilValue } from "recoil";
import { currTabState } from "./recoil";

const Role = (props) => {
  //props
  const { componentId, intl } = props;

  //state
  const currentTab = useRecoilValue(currTabState);

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.role),
      },
    },
  });

  //function -------------------------------------------------------------------------------------------------------------

  //render ---------------------------------------------------------------------------------------------------------------

  //screens
  const tabs = [
    { key: "type_list", render: <TypeList /> },
    { key: "item_pick", render: <ItemPicker /> },
    { key: "role_list", render: <RoleList /> },
  ];

  const renderTab = () => {
    const activeTab = tabs.findIndex((item) => item.key == currentTab);

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

  return <View style={styles.container}>{renderTab()}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: color.backgroundColor,
  },
});

export default injectIntl(Role);
