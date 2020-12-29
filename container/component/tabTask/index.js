import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ListTask from "./ListTask";
import DetailTask from "./DetailTask";
import { color, shadow } from "container/variables/common";

const TabTask = (props) => {
  console.log("TabTask:::", global, global.organization);
  //state
  const [mode, setMode] = useState("list");

  //change mode to switch screen
  const onChangeMode = (mode = "list") => {
    setMode(mode);
  };

  //render
  const tabs = {
    list: <ListTask changeMode={onChangeMode} mode={mode} />,
    detail: (
      <DetailTask changeMode={onChangeMode} mode={mode} data={props.data} />
    ),
  };

  return <View style={styles.container}>{tabs[mode]}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    ...shadow,
  },
});

export default TabTask;
