import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SearchBox from "container/component/ui/searchBox";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import { Icon, Tabs, Tab, ScrollableTab } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";

const DEFAULT_DATA = [
  {
    id: "1",
    categoryName: "today",
    isExpanded: true,
    subCategory: [],
  },
];

const ListTask = (props) => {
  //props
  const { style, intl } = props;
  //state
  const [data, setData] = useState(DEFAULT_DATA);
  //variables
  let pageTabs = [0];

  const selectStatus = () => {
    console.log("selectStatus");
  };
  const handleItemClick = (index) => {
    console.log(index);
  };

  const handleInnerItemClick = (innerIndex, item, itemIndex) => {
    console.log(innerIndex);
  };

  const loadMore = (index) => {};

  //render
  const renderPriorLevel = (level) => {
    let colors =
      level == 1 ? color.red : level == 2 ? color.orange : color.green;
    return (
      <View
        style={[styles.priorLevel, style, { backgroundColor: colors }]}
      ></View>
    );
  };

  const renderItemTask = (item) => (
    <View style={[styles.taskContent, style]}>
      {renderPriorLevel(item.priorLevel)}
      <View style={[styles.taskTitle, style]}>
        <Text numberOfLines={1}>{item.name}</Text>
      </View>
      {item.isDone ? (
        <Icon
          type="Ionicons"
          name="md-checkmark-circle"
          style={{ ...defaultText, fontSize: scale(50), color: color.green }}
        />
      ) : (
        <Icon
          type="Ionicons"
          name="md-checkmark-circle-outline"
          style={{ ...defaultText, fontSize: scale(50) }}
        />
      )}
    </View>
  );

  const renderFilter = () => {
    return (
      <View style={[styles.filter, style]}>
        <View style={{ flexDirection: "row", marginBottom: scale(20) }}>
          <View style={[styles.itemFilter, { marginLeft: 0 }, style]}>
            <Text style={[styles.titleFilter, style]}>
              {intl.formatMessage(Messages.status)}
            </Text>
            <TouchableOpacity onPress={() => selectStatus()}>
              <View style={[styles.noneItem, style]}>
                <View style={[styles.noneItem2, style]}></View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.itemFilter, style]}>
            <Text style={[styles.titleFilter, style]}>
              {intl.formatMessage(Messages.priority)}
            </Text>
            <TouchableOpacity>
              <View style={[styles.noneItem, style]}>
                <View style={[styles.noneItem2, style]}></View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.itemFilter, style]}>
            <Text style={[styles.titleFilter, style]}>
              {intl.formatMessage(Messages.deadline)}
            </Text>
            <TouchableOpacity>
              <View style={[styles.noneItem, style]}>
                <View style={[styles.noneItem2, style]}></View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.itemFilter, style]}>
            <Text style={[styles.titleFilter, style]}>
              {intl.formatMessage(Messages.sort)}
            </Text>
            <TouchableOpacity>
              <View style={[styles.noneItem, style]}>
                <View style={[styles.noneItem2, style]}></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <SearchBox style={styles.searchBox} />
      </View>
    );
  };

  const renderEntityTab = (tab, index) => {
    const heading = (
      <View>
        <Text style={{ ...defaultText }}>{tab.name}</Text>
        <View style={styles.dot}>
          <Text style={{ ...defaultText, fontSize: fontSize.size26 }}>
            {tab.number}
          </Text>
        </View>
      </View>
    );
    return (
      <Tab heading={heading} locked>
        {tab.data && tab.data.items && tab.data.items.length ? (
          <FlatList
            data={tab.data.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderItemTask(item)}
            onEndReached={() => loadMore(index)}
          />
        ) : (
          <View style={styles.boxEmpty}>
            <Text style={styles.textEmpty}>
              {intl.formatMessage(Messages.empty_data)}
            </Text>
          </View>
        )}
      </Tab>
    );
  };

  const renderTabs = () => {
    return (
      <Tabs
        renderTabBar={() => <ScrollableTab style={styles.tabWrapper} />}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
      >
        {data.map((item, index) => renderEntityTab(item, index))}
      </Tabs>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderFilter()}
      {renderTabs()}
    </View>
  );
};
const styles = StyleSheet.create({
  priorLevel: {
    height: "100%",
    aspectRatio: 1,
    flex: 0.07,
    backgroundColor: "#dad",
    borderRadius: scale(15),
    marginRight: scale(20),
  },
  task: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    alignItems: "center",
    padding: scale(10),
    paddingRight: 0,
    ...shadow,
  },
  taskTitle: {
    flex: 0.9,
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  noneItem: {
    backgroundColor: "#ddd",
    borderRadius: scale(30),
    width: "100%",
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  noneItem2: {
    backgroundColor: "#fff",
    borderRadius: scale(30),
    width: "30%",
    height: scale(10),
  },
  filter: {
    margin: scale(20),
    marginBottom: space.itemMargin * 2,
    borderBottomWidth: scale(4),
    paddingBottom: scale(20),
    borderColor: color.backgroundColor,
  },
  itemFilter: {
    marginLeft: scale(10),
    flex: 1,
    backgroundColor: "#fff",
  },
  titleFilter: {
    ...defaultText,
    alignSelf: "center",
    marginBottom: scale(5),
    fontStyle: "italic",
  },
  searchBox: {},
  tabWrapper: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
  },
  tabBarUnderlineStyle: {
    height: scale(4),
    backgroundColor: color.success,
    marginTop: scale(15),
  },
  dot: {
    justifyContent: "center",
    alignItems: "center",
    height: scale(38),
    minWidth: scale(38),
    borderRadius: scale(19),
    backgroundColor: color.primary,
  },
  boxEmpty: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent,
  },
});

export default injectIntl(ListTask);
