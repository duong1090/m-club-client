import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { scale, color, fontSize, space } from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import Information from "./Information";
import ManageItem from "./ManageItem";
import { gotoRoute } from "container/utils/router";
import screens from "container/constant/screen";

const DEFAULT_MANAGE_LIST = [
  {
    title: <FormattedMessage {...Messages.member} />,
    type: screens.MEMBER_LIST,
  },
  { title: <FormattedMessage {...Messages.department} />, type: "department" },
  { title: <FormattedMessage {...Messages.position} />, type: "position" },
  { title: <FormattedMessage {...Messages.funds} />, type: "funds" },
];

const TabAccount = (props) => {
  const gotoManageItem = (type) => {
    if (type == screens.MEMBER_LIST) gotoRoute(type);
  };

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
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Information style={styles.information} />
      {renderManageList()}
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
});

export default TabAccount;
