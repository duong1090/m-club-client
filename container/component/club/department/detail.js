import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { Icon, Spinner } from "native-base";
import SimpleDetail from "container/component/ui/simpleDetail";

const DEFAULT_AVATAR = {
  source: "",
  loading: true,
};

const DepartmentDetail = (props) => {
  const [avatar, setAvatar] = useState({});

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          {/* TODO:  Avatar component*/}
          <View style={styles.avatarBox}>
            <Image style={styles.avatar} />
          </View>
          <View style={styles.iconBox}>
            <Icon
              name="camera"
              style={{ ...defaultText, fontSize: scale(20) }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleDetail header={renderHeader()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {},
  avatarBox: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    resizeMode: "contain",
  },
  iconBox: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: color.backgroundColor,
    width: scale(50),
    width: scale(50),
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default injectIntl(DepartmentDetail);
