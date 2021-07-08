import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import NotificationList from "./component/list";
import { color } from "container/variables/common";

const TabNotification = (props) => {
  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      layout: {
        componentBackgroundColor: color.background,
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <NotificationList {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
});

export default TabNotification;
