import { Icon } from "native-base";
import React, { useContext } from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
  shadow,
} from "container/variables/common";
import { Navigation } from "react-native-navigation";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { setLanguage } from "container/action/setting";
import ModalContext from "container/context/modal";

const Setting = (props) => {
  const { intl, componentId } = props;
  const modalContext = useContext(ModalContext);

  console.log("Setting:::", global);

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.setting),
      },
    },
  });

  //function - event --------------------------------------------------------------------
  const changeLanguage = () => {
    const actions = [
      {
        title: intl.formatMessage(Messages.vi),
        onPress: () => setLanguage("vi"),
      },
      {
        title: intl.formatMessage(Messages.en),
        onPress: () => setLanguage("en"),
      },
    ];
    modalContext.showActionSheet({ actions });
  };

  //render ------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => changeLanguage()}
      >
        <View style={styles.headerItem}>
          <Icon
            type="FontAwesome5"
            name="globe-asia"
            style={styles.settingIcon}
          />
          <Text style={styles.settingTitle}>
            {intl.formatMessage(Messages.language)}
          </Text>
        </View>
        <Text style={styles.settingValue}>
          {global.lang && global.lang == "vi"
            ? intl.formatMessage(Messages.vi)
            : global.lang == "en"
            ? intl.formatMessage(Messages.en)
            : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: color.backgroundColor,
    padding: space.bgPadding,
  },
  settingItem: {
    backgroundColor: "#fff",
    padding: space.bgPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: space.border,
    ...shadow,
  },
  headerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    color: color.primary,
    fontSize: scale(50),
    marginRight: space.componentMargin,
  },
  settingTitle: {
    ...defaultText,
    fontSize: fontSize.sizeContent,
    color: color.primary,
  },
  settingValue: {
    ...defaultText,
    fontSize: fontSize.sizeContent,
    fontWeight: "bold",
  },
});

export default injectIntl(Setting);
