import React, { useEffect } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { getOrganization } from "container/action/user";
import { useSetRecoilState } from "recoil";
import { userState } from "container/recoil/state/user";
import {
  scale,
  color,
  defaultText,
  fontSize,
  space,
} from "container/variables/common";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";

const TabNavigate = (props) => {
  const { intl } = props;

  const setUser = useSetRecoilState(userState);

  // useEffect(() => {
  //   getOrganization().then((res) => {
  //     if (res && res.data) {
  //       setUser(res.data);
  //     }
  //   });
  // }, []);

  const header = () => {
    return (
      <View style={styles.header}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.elTwoHeader}>
            <Image
              style={styles.logo}
              source={require("container/asset/image/Mclub-cirLogo.png")}
            />
          </View>
          <Text style={styles.welcome}>
            {intl.formatMessage(Messages.welcome_to_mclub)}
          </Text>
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{header()}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  header: {
    height: scale(300),
    marginBottom: scale(100),
  },
  elTwoHeader: {
    width: scale(164),
    height: scale(164),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(82),
    borderWidth: scale(4),
    borderColor: color.fontColor,
    backgroundColor: "#fff",
  },
  logo: {
    width: scale(160),
    height: scale(160),
    resizeMode: "contain",
  },
  welcome: {
    ...defaultText,
    fontSize: fontSize.size50,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: space.componentMargin,
    alignSelf: "center",
  },
});

export default injectIntl(TabNavigate);
