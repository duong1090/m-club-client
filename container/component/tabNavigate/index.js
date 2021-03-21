import React, { useEffect } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
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

  return <View style={styles.container}>
    {header()}
    <View style={styles.description}>
      <Text> {intl.formatMessage(Messages.desciption_home)} </Text>
      <Text>►   {intl.formatMessage(Messages.fund_management)}</Text>
      <Text>►   {intl.formatMessage(Messages.hr_management)}</Text>
      <Text>►   {intl.formatMessage(Messages.task_management)}</Text>
      <Text>►   {intl.formatMessage(Messages.noti_management)}</Text>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  description: {
    ...defaultText,
    // backgroundColor: 'red',
    // color: '#00aaaa',
    marginTop: scale(70),
    marginBottom: 0,
    width: '70%',
  },
  header: {
    height: scale(300),
    marginBottom: scale(100),
  },
  elTwoHeader: {
    width: scale(420),
    height: scale(420),
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.fontColor,
  },
  logo: {
    width: scale(420),
    height: scale(420),
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
