import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import SearchBox from "container/component/ui/searchBox";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import ActionButton from "react-native-action-button";
import EntypoIcon from "react-native-vector-icons/Entypo";

const SimpleList = (props) => {
  const {
    data,
    intl,
    addNewItem,
    iconItem,
    styleTextItem,
    styleDesItem,
    onPressItem,
  } = props;

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)} style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.dot} />
          <View>
            <Text style={[styles.textItem, styleTextItem]}>{item.name}</Text>
            {item.description ? (
              <Text style={[styles.description, styleDesItem]}>
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
        {iconItem ? iconItem : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBox />
      <FlatList
        style={styles.body}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: scale(30) }}
      />
      {addNewItem ? (
        <ActionButton
          offsetX={scale(30)}
          offsetY={scale(30)}
          style={{ elevation: 100 }}
          renderIcon={() => {
            return <EntypoIcon name="plus" style={styles.actionButtonIcon} />;
          }}
          buttonColor={color.warning}
          onPress={() => addNewItem()}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    height: "100%",
  },
  body: {
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
    flex: 1,
  },
  dot: {
    width: scale(20),
    height: scale(20),
    backgroundColor: color.warning,
    borderRadius: scale(15),
    marginRight: space.componentMargin,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.componentMargin,
    paddingHorizontal: space.componentMargin,
    marginBottom: space.itemMargin,
    backgroundColor: "#fff",
    borderRadius: scale(20),
    ...shadow,
  },
  textItem: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent,
  },
  desItem: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent - scale(2),
    marginTop: space.itemMargin,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
});

export default injectIntl(SimpleList);