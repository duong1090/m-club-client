import React from "react";
import { View,StyleSheet } from "react-native";
import HeaderInfo from "./HeaderInfo.js";
import ListTask from "./ListTask.js";
import {
  scale,
  shadow,
} from "container/variables/common";

const TabTask = (props) => {
  return (
    <View style={styles.container}>
      <HeaderInfo />
      <ListTask />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      backgroundColor: "#eee",
      height: '100%',
      ...shadow,
  },
});

export default TabTask;
