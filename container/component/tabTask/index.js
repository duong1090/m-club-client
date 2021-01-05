import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ListTask from "./component/list";
import DetailTask from "./component/detail";
import { color, shadow } from "container/variables/common";
import { Tabs, Tab, Container, ScrollableTab } from "native-base";

const TabTask = (props) => {
  console.log("TabTask:::", global, global.organization);
  //state
  const [mode, setMode] = useState("list");

  //effect
  useEffect(() => {
    if (props.mode) setMode(props.mode);
  }, [props.mode]);

  //change mode to switch screen
  const onChangeMode = (mode = "list") => {
    console.log("onChangeMode:::", mode);
    setMode(mode);
  };

  //render
  // const tabs = {
  //   list: <ListTask changeMode={onChangeMode} mode={mode} />,
  //   detail: (
  //     <DetailTask changeMode={onChangeMode} mode={mode} data={props.data} />
  //   ),
  // };

  const renderMode = (mode) => {
    const activeTab = mode == "detail" ? 1 : 0;
    console.log("renderMode:::", mode, activeTab);
    return (
      <Tabs
        initialPage={0}
        page={activeTab}
        locked
        onChangeTab={(e) => {
          switch (e.i) {
            case 0:
              setMode("list");
              break;
            case 1:
              setMode("detail");
              break;
          }
        }}
        renderTabBar={() => <ScrollableTab style={{ height: 0 }} />}
      >
        <Tab heading="" style={{ backgroundColor: "transparent" }}>
          <ListTask changeMode={onChangeMode} mode={mode} />
        </Tab>
        <Tab heading="" style={{ backgroundColor: "transparent" }}>
          <DetailTask changeMode={onChangeMode} mode={mode} data={props.data} />
        </Tab>
      </Tabs>
    );
  };

  return <View style={styles.container}>{renderMode(mode)}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    ...shadow,
  },
});

export default TabTask;
