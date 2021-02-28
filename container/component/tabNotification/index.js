import React from "react";
import { StyleSheet, View } from "react-native";
import NotificationList from "./component/list";

const TabNotification = (props) => {
  return (
    <View style={styles.container}>
      <NotificationList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default TabNotification;
