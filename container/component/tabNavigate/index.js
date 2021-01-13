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
              source={require("container/asset/image/MclubLogo.png")}
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
    backgroundColor: color.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  header: {
    height: scale(300),
    marginBottom: scale(100),
  },
  elTwoHeader: {
    width: scale(250),
    height: scale(250),
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.fontColor,
  },
  logo: {
    width: scale(250),
    height: scale(250),
    resizeMode: "contain",
  },
  welcome: {
    ...defaultText,
    fontSize: fontSize.size36,
    color: "#00aaaa",
    fontWeight: "bold",
    marginVertical: space.componentMargin,
    marginHorizontal: scale(60),
    textAlign: "center",
    alignSelf: "center",
  },
});

export default injectIntl(TabNavigate);
