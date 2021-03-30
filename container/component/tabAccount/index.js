import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  scale,
  color,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import Information from "./component/Information";
import ManageItem from "./component/ManageItem";
import { gotoRoute } from "container/utils/router";
import { screens } from "container/constant/screen";
import { Icon } from "native-base";
import { showSpinner, hideSpinner } from "container/utils/router";
import { logOut } from "container/action/user";
import { normalRole, isRoot } from "container/constant/role";
import PrivilegeAction from "container/component/ui/privilegeAction";
import ActionButton from "container/component/ui/actionButton";

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

  const DEFAULT_MANAGE_LIST = [
    {
      title: <FormattedMessage {...Messages.member} />,
      type: screens.MEMBER,
      icon: <Icon type="FontAwesome5" name="user" style={styles.iconList} />,
      privilege: normalRole.MEM_VIEW,
    },
    {
      title: <FormattedMessage {...Messages.department} />,
      type: screens.DEPARTMENT,
      icon: <Icon type="FontAwesome5" name="users" style={styles.iconList} />,
      privilege: normalRole.DEPT_VIEW,
    },
    {
      title: <FormattedMessage {...Messages.position} />,
      type: screens.POSITION,
      icon: (
        <Icon type="FontAwesome5" name="user-tag" style={styles.iconList} />
      ),
      privilege: normalRole.POS_VIEW,
    },
    {
      title: <FormattedMessage {...Messages.funds} />,
      type: screens.FUNDS,
      icon: <Icon type="FontAwesome5" name="wallet" style={styles.iconList} />,
      privilege: normalRole.FUND_VIEW,
    },
    {
      title: <FormattedMessage {...Messages.role} />,
      type: screens.ROLE,
      icon: <Icon type="FontAwesome5" name="wallet" style={styles.iconList} />,
      privilege: isRoot,
    },
  ];

  const renderManageList = () => {
    return (
      <FlatList
        columnWrapperStyle={{ flexWrap: "wrap" }}
        contentContainerStyle={styles.manageList}
        numColumns={2}
        data={DEFAULT_MANAGE_LIST}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <PrivilegeAction privilegeKey={item.privilege}>
            <ManageItem
              data={item}
              onPress={() => gotoManageItem(item.type)}
              style={index % 2 ? { marginLeft: space.componentMargin } : null}
              icon={item.icon}
            />
          </PrivilegeAction>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Information style={styles.information} />
      {renderManageList()}
      <ActionButton
        title={intl.formatMessage(Messages.log_out)}
        icon={
          <Icon
            name="sign-out-alt"
            type="FontAwesome5"
            style={styles.actionButtonIcon}
          />
        }
        color={color.danger}
        style={styles.actionButtonBox}
        onPress={() => doLogOut()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  information: {
    width: "100%",
  },
  manageList: {
    flex: 1,
    padding: space.bgPadding,
    borderTopWidth: scale(4),
    borderColor: color.backgroundColor,
  },
  actionButtonBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scale(15),
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    backgroundColor: color.danger,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: space.border,
    ...shadow,
  },
  actionButtonText: {
    ...defaultText,
    color: "#fff",
  },
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
    marginRight: scale(10),
  },
  iconList: {
    ...defaultText,
    fontSize: scale(50),
    color: color.background,
  },
});

export default TabAccount;
