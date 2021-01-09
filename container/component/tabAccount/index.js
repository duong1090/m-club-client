import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  scale,
  color,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import Information from "./Information";
import ManageItem from "./ManageItem";
import { gotoRoute } from "container/utils/router";
import { screens } from "container/constant/screen";
import { Icon } from "native-base";
import ActionButton from "react-native-action-button";
import { showSpinner, hideSpinner } from "container/utils/router";
import { logOut } from "container/action/user";

const DEFAULT_MANAGE_LIST = [
  {
    title: <FormattedMessage {...Messages.member} />,
    type: screens.MEMBER,
    icon: (
      <Icon
        type="FontAwesome5"
        name="user"
        style={{ ...defaultText, fontSize: scale(50) }}
      />
    ),
  },
  {
    title: <FormattedMessage {...Messages.department} />,
    type: screens.DEPARTMENT,
    icon: (
      <Icon
        type="FontAwesome5"
        name="users"
        style={{ ...defaultText, fontSize: scale(50) }}
      />
    ),
  },
  {
    title: <FormattedMessage {...Messages.position} />,
    type: screens.POSITION,
    icon: (
      <Icon
        type="FontAwesome5"
        name="user-tag"
        style={{ ...defaultText, fontSize: scale(50) }}
      />
    ),
  },
  {
    title: <FormattedMessage {...Messages.funds} />,
    type: screens.FUNDS,
    icon: (
      <Icon
        type="FontAwesome5"
        name="wallet"
        style={{ ...defaultText, fontSize: scale(50) }}
      />
    ),
  },
];

const TabAccount = (props) => {
  //function - event
  const gotoManageItem = (type) => {
    gotoRoute(type);
  };

  const doLogOut = () => {
    showSpinner();
    logOut()
      .then((res) => {
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  //render
  const renderManageList = () => {
    return (
      <FlatList
        columnWrapperStyle={{ flexWrap: "wrap" }}
        style={styles.manageList}
        numColumns={2}
        data={DEFAULT_MANAGE_LIST}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ManageItem
            data={item}
            onPress={() => gotoManageItem(item.type)}
            style={index % 2 ? { marginLeft: space.componentMargin } : null}
            icon={item.icon}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Information style={styles.information} />
      {renderManageList()}
      <ActionButton
        offsetX={scale(30)}
        offsetY={scale(30)}
        style={{ ...shadow }}
        renderIcon={() => {
          return (
            <Icon
              name="sign-out-alt"
              type="FontAwesome5"
              style={styles.actionButtonIcon}
            />
          );
        }}
        buttonColor={color.danger}
        onPress={() => doLogOut()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
  },
  information: {
    width: "100%",
    marginBottom: space.componentMargin,
  },
  manageList: {
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
});

export default TabAccount;
