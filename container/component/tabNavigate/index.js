import React, { useEffect } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { scale, color, fontSize, space } from "container/variables/common";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import FastImage from "react-native-fast-image";

const TabNavigate = (props) => {
  const { intl } = props;

  // useEffect(() => {
  //   getOrganization().then((res) => {
  //     if (res && res.data) {
  //       setUser(res.data);
  //     }
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <FastImage
        source={require("container/asset/image/rsz_splashscreen.png")}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default injectIntl(TabNavigate);
