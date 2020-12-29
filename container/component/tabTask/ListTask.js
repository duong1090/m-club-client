import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
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
import { useRecoilState, useSetRecoilState } from "recoil";
import { listTaskState, currTaskState } from "container/recoil/state/tabTask";
import { Icon, Tabs, Tab, ScrollableTab } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import ActionButton from "react-native-action-button";
import CreateTask from "./CreateTask";
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import HeaderInfo from "./HeaderInfo";
import { showSpinner, hideSpinner } from "container/utils/router";

const TODAY = 0,
  FUTURE = 1,
  TIMED = 2,
  NO_TIME = 3;

const ListTask = (props) => {
  //props
  const { style, intl, changeMode, mode } = props;
  //state
  const [data, setData] = useRecoilState(listTaskState);
  const setCurrTask = useSetRecoilState(currTaskState);
  // const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState(0);

  //variables
  const createTaskRef = useRef(null);

  //effect
  useEffect(() => {
    getData();
  }, []);

  //function - event
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

  const openCreatePopUp = () => {
    createTaskRef.current.show();
  };

  const getData = () => {
    showSpinner();
    getRequest(Config.API_URL.concat("task/get"))
      .then((res) => {
        if (res && res.data) {
          console.log("getTask:::", res.data);
          let temp = [...data];
          temp[TODAY].data = res.data.today;
          temp[FUTURE].data = res.data.future;
          temp[TIMED].data = res.data.timed;
          temp[NO_TIME].data = res.data.no_time;
          setData(temp);
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.log(err);
      });
  };

  const gotoDetail = async (item, indexTab) => {
    setCurrTask({ ...item, indexTab });
    changeMode && changeMode("detail");
  };

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

  const renderItemTask = (item, indexTab) => (
    <TouchableOpacity
      onPress={() => gotoDetail(item, indexTab)}
      style={[styles.taskContent, style]}
    >
      {renderPriorLevel(item.prior_level)}
      <View style={[styles.taskTitle, style]}>
        <Text numberOfLines={1}>{item.name}</Text>
      </View>
      {item.is_done ? (
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
    </TouchableOpacity>
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

  const renderEntityTab = (tab, indexTab) => {
    const heading = (
      <View
        style={[
          styles.headingBox,
          activeTab != indexTab ? { backgroundColor: color.lightGrey } : null,
        ]}
      >
        <Text
          style={{
            ...defaultText,
            fontWeight: "bold",
          }}
        >
          {tab.name}
        </Text>
        {tab.data && tab.data.length > 0 ? (
          <View style={styles.dot}>
            <Text
              style={{
                ...defaultText,
                fontSize: fontSize.size20,
                color: "#fff",
              }}
            >
              {tab.data.length <= 99 ? tab.data.length : "+99"}
            </Text>
          </View>
        ) : null}
      </View>
    );
    return (
      <Tab heading={heading} style={{ backgroundColor: color.backgroundColor }}>
        {tab.data && tab.data.length ? (
          <FlatList
            data={tab.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderItemTask(item, indexTab)}
            // onEndReached={() => loadMore(index)}
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
        onChangeTab={(event) => setActiveTab(event.i)}
        locked
        renderTabBar={() => <ScrollableTab style={styles.tabWrapper} />}
        tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
      >
        {data.map((item, index) => renderEntityTab(item, index))}
      </Tabs>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <HeaderInfo />
      {renderFilter()}
      {renderTabs()}

      <ActionButton
        offsetX={scale(30)}
        offsetY={scale(30)}
        style={{ ...shadow }}
        renderIcon={() => {
          return (
            <Icon name="plus" type="Entypo" style={styles.actionButtonIcon} />
          );
        }}
        buttonColor={color.warning}
        onPress={() => openCreatePopUp()}
      />
      <CreateTask ref={createTaskRef} />
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
    padding: scale(20),
    paddingVertical: scale(10),
    margin: space.itemMargin,
    marginBottom: 0,
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
    backgroundColor: color.lightGrey,
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
    height: scale(80),
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: scale(-2),
    marginHorizontal: scale(10),
  },
  tabBarUnderlineStyle: {
    height: 0,
  },
  dot: {
    position: "absolute",
    top: scale(-20),
    right: scale(-20),
    justifyContent: "center",
    alignItems: "center",
    height: scale(45),
    width: scale(45),
    borderRadius: scale(23),
    backgroundColor: color.danger,
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
  actionButtonIcon: {
    fontSize: 25,
    color: "#fff",
  },
  headingBox: {
    width: scale(200),
    marginTop: scale(20),
    marginRight: scale(20),
    backgroundColor: color.info,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
    backgroundColor: color.backgroundColor,
  },
});

export default injectIntl(ListTask);
