import React, { useContext, useEffect } from "react";
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
} from "container/variables/common";
import ModalContext from "container/context/modal";
import { Icon } from "native-base";
import EmptyData from "container/component/ui/emptyData";
import PrivilegeAction from "container/component/ui/privilegeAction";
import ActionButton from "container/component/ui/actionButton";

const SimpleList = (props) => {
  const {
    data,
    intl,
    addNewItem,
    iconItem,
    styleTextItem,
    styleDesItem,
    onPressItem,
    loading,
    loadMore,
    iconHeader,
    onSearch,
    privilege,
  } = props;

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //effect
  useEffect(() => {
    if (loading) showSpinner();
    else hideSpinner();
  }, [loading]);

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)} style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {iconHeader ? (
            <View style={{ marginRight: space.componentMargin }}>
              {iconHeader(item)}
            </View>
          ) : (
            <View style={styles.dot} />
          )}
          <View>
            <Text style={[styles.textItem, styleTextItem]}>{item.title}</Text>
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
      <View style={styles.searchBox}>
        <SearchBox onSearch={onSearch} />
      </View>
      {loading ? null : (
        <FlatList
          contentContainerStyle={styles.body}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderItem(item)}
          onEndReached={loadMore}
          ListEmptyComponent={<EmptyData />}
        />
      )}
      {addNewItem ? (
        <PrivilegeAction privilegeKey={privilege.create}>
          <ActionButton
            title={intl.formatMessage(Messages.add)}
            icon={
              <Icon name="plus" type="Entypo" style={styles.actionButtonIcon} />
            }
            style={styles.actionButtonBox}
            onPress={() => addNewItem()}
          />
        </PrivilegeAction>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.backgroundColor,
    height: "100%",
  },
  body: {
    padding: space.bgPadding,
    marginBottom: space.componentMargin,
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
    fontSize: fontSize.sizeBigContent,
  },
  desItem: {
    fontSize: fontSize.sizeBigContent - scale(2),
    marginTop: space.itemMargin,
  },
  actionButtonIcon: {
    fontSize: 25,
    color: "#fff",
  },
  boxEmpty: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    fontSize: fontSize.sizeBigContent,
  },
  searchBox: {
    backgroundColor: "#fff",
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
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
    backgroundColor: color.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: space.border,
    ...shadow,
  },
  actionButtonText: {
    color: "#fff",
  },
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
});

export default injectIntl(SimpleList);
