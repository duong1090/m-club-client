import { Icon } from "native-base";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { currTypeState, currTabState } from "../recoil";
import { useSetRecoilState } from "recoil";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";

export const DEFAULT_TYPE = [
  {
    icon: {
      name: "users",
      type: "FontAwesome5",
    },
    value: "department",
  },
  {
    icon: {
      name: "user-tag",
      type: "FontAwesome5",
    },
    value: "position",
  },
  {
    icon: {
      name: "user",
      type: "FontAwesome5",
    },
    value: "member",
  },
];

const TypeList = (props) => {
  const { intl } = props;

  //recoil
  const setCurrType = useSetRecoilState(currTypeState);
  const setCurrTab = useSetRecoilState(currTabState);

  //function -------------------------------------------------------------------------------------

  const selectType = (item) => {
    setCurrType(item.value);
    setCurrTab("item_pick");
  };

  //render ---------------------------------------------------------------------------------------

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => selectType(item)}
        style={styles.itemBox(index)}
      >
        <Text style={styles.textItem}>
          {intl.formatMessage(Messages[item.value])}
        </Text>
        <Icon
          name={item.icon.name}
          type={item.icon.type}
          style={styles.iconItem}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={DEFAULT_TYPE}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => renderItem(item, index)}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  itemBox: (index) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    ...shadow,
    padding: space.bgPadding,
    borderRadius: space.border,
    marginHorizontal: space.componentMargin,
    marginBottom: space.itemMargin,
    marginTop: index == 0 ? space.componentMargin : 0,
  }),
  textItem: {},
  iconItem: {
    fontSize: scale(30),
    color: color.background,
  },
});

export default injectIntl(TypeList);
