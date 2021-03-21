import { Tabs, ScrollableTab } from "native-base";
import React from "react";
import { View } from "react-native";
import ItemPicker from "./itemPicker";
import RoleList from "./roleList";
import TypeList from "./typeList";

const Role = (props) => {
  //screens
  const tabs = [
    { key: "type_list", render: <TypeList /> },
    { key: "item_pick", render: <ItemPicker /> },
    { key: "role_list", render: <RoleList /> },
  ];

  const renderTab = (tab) => {
    const activeTab = tabs.findIndex((item) => item.key == tab);

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

  return <View>{renderTab(tab)}</View>;
};

export default Role;
