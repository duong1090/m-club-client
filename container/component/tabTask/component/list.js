import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import SearchBox from "container/component/ui/searchBox";
import {
  scale,
  color,
  fontSize,
  shadow,
  defaultText,
} from "container/variables/common";

import { styles, AVATAR_SIZE } from "../style/list";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listTaskState, currTaskState } from "../recoil";
import { Icon, Tabs, Tab, ScrollableTab, CheckBox } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import CreateTask from "./create";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import HeaderInfo from "../ui/HeaderInfo";
import { showSpinner, hideSpinner } from "container/utils/router";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import { repairParams } from "container/helper/format";
import { gotoRoute } from "container/utils/router";
import { modals, screens } from "container/constant/screen";
import { PRIORITY_LEVEL } from "container/constant/element";
import Avatar from "container/component/ui/avatar";
import EmptyData from "container/component/ui/emptyData";

const TODAY = 0,
  FUTURE = 1,
  TIMED = 2,
  NO_TIME = 3;

const DEFAULT_FILTER = {
  is_done: 0,
  user_ids: [],
  prior_level: 4,
};

const ListTask = (props) => {
  //props
  const { style, intl, changeMode, mode } = props;
  //state
  const [data, setData] = useRecoilState(listTaskState);
  const setCurrTask = useSetRecoilState(currTaskState);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  //variables
  const createTaskRef = useRef(null);
  const debounceSearch = useRef(debounce((text) => doFilter("name", text), 200))
    .current;

  //effect
  useEffect(() => {
    getData();
  }, []);

  //function - event -----------------------------------------------------------------------------------------------------------------------

  const openCreatePopUp = () => {
    createTaskRef.current.show();
  };

  const getData = () => {
    showSpinner();
    getRequest(Config.API_URL.concat("task/get"))
      .then((res) => {
        if (res && res.data) getDataSuccess(res);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.log(err);
      });
  };

  const getDataSuccess = (response) => {
    let temp = JSON.parse(JSON.stringify(data));
    temp[TODAY].data = response.data.today;
    temp[FUTURE].data = response.data.future;
    temp[TIMED].data = response.data.timed;
    temp[NO_TIME].data = response.data.no_time;
    setData(temp);
  };

  const gotoDetail = async (item, index) => {
    setCurrTask({ ...item, index });
    // changeMode && changeMode("detail");
    gotoRoute(screens.TAB_TASK, {
      data: { ...item, index },
      mode: "detail",
      listTask: data,
      setListTask: setData,
    });
  };

  const checkDoneTask = (item, index, indexTab) => {
    let params = {
      id: item.id,
    };
    const isDone =
      data[indexTab].data && data[indexTab].data[index]
        ? data[indexTab].data[index].is_done
        : 0;
    params.is_done = isDone ? 0 : 1;
    postRequest(Config.API_URL.concat("task/update-task-status"), params).then(
      (res) => {
        if (res) {
        }
      }
    );
    setData(
      update(data, {
        [indexTab]: { data: { [index]: { is_done: { $set: !isDone } } } },
      })
    );
  };

  const openFilter = (type) => {
    let passProps = {};
    if (type == "priority")
      passProps = {
        onSelectItem: (value) => {
          let temp = { ...filter };
          temp.prior_level = value.id;
          setFilter(temp);
          doFilter("prior_level", value.id);
        },
        data: PRIORITY_LEVEL.map((item) => {
          return { ...item, name: intl.formatMessage(Messages[item.name]) };
        }),
      };
    else if (type == "member")
      passProps = {
        onSelectItem: (value) => {
          let temp = { ...filter };
          temp.user_ids = value;
          setFilter(temp);
          doFilter(
            "user_ids",
            temp.user_ids.map((item) => item.id)
          );
        },
        selectedItem: filter.user_ids,
        api: "member/get",
        params: { type: "simple" },
        multiSelect: true,
        isMember: true,
      };
    gotoRoute(modals.SELECT_MODAL, passProps, true);
  };

  const doFilter = (type = "name", value) => {
    showSpinner();
    const params =
      value || value == 0
        ? repairParams({ ...filter, [type]: value })
        : repairParams({ ...filter });

    getRequest(Config.API_URL.concat("task/get").concat(`?${params}`))
      .then((res) => {
        if (res && res.data) getDataSuccess(res);
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  //render --------------------------------------------------------------------------------------------------------------------

  const renderItemTask = (item, index, indexTab) => (
    <View style={styles.childrenItem}>
      <TouchableOpacity
        onPress={() => {
          console.log("onPressRenderItemTask::::", item, index);
          gotoDetail(item, index);
        }}
        style={styles.childrenItemHeader}
      >
        <View style={styles.childrenItemPriorLevel(item.prior_level)} />
        <Text numberOfLines={1} style={styles.childrenItemName}>
          {item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => checkDoneTask(item, index, indexTab)}
        style={styles.childrenItemBtnDone}
      >
        {item.is_done ? (
          <Icon
            type="Ionicons"
            name="md-checkmark-circle"
            style={styles.childrenItemDone(item.is_done)}
          />
        ) : (
          <Icon
            type="Ionicons"
            name="md-checkmark-circle-outline"
            style={styles.childrenItemDone(item.is_done)}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderAvatar = () => {
    const limit = 3;
    if (filter.user_ids.length == 1) {
      return (
        <View style={styles.contentMemAvtBox}>
          <Text numberOfLines={2} style={styles.contentMemName}>
            {filter.user_ids[0].name}
          </Text>
          <Avatar size={AVATAR_SIZE} data={filter.user_ids[0]} />
        </View>
      );
    } else if (filter.user_ids.length > limit)
      return (
        <View style={styles.contentMemAvtBox}>
          {[...Array(limit + 1).keys()].map((item, index) => {
            if (index >= limit)
              return (
                <View
                  style={[
                    styles.contentMemAvtMore,
                    styles.contentMemAvt,
                    { right: (index - limit + 1) * (AVATAR_SIZE / 2) },
                  ]}
                >
                  <Text style={styles.contentMemAvtMoreText}>
                    {`+${filter.user_ids.length - limit}`}
                  </Text>
                </View>
              );
            else
              return (
                <Avatar
                  style={[
                    styles.contentMemAvt,
                    { right: (limit + 1 - index) * (AVATAR_SIZE / 2) },
                  ]}
                  size={AVATAR_SIZE}
                  data={filter.user_ids[index]}
                />
              );
          })}
        </View>
      );
    else if (filter.user_ids.length == 0) {
      return (
        <View style={styles.contentMemAdd}>
          <Icon
            type="FontAwesome5"
            name="user"
            style={styles.contentMemAddIcon}
          />
        </View>
      );
    } else
      return (
        <View style={styles.contentMemAvtBox}>
          {filter.user_ids.map((item, index) => (
            <Avatar
              style={[
                styles.contentMemAvt,
                {
                  right:
                    (filter.user_ids.length - 1 - index) * (AVATAR_SIZE / 2),
                },
              ]}
              size={AVATAR_SIZE}
              data={item}
            />
          ))}
        </View>
      );
  };

  const renderFilter = () => {
    return (
      <View style={styles.filter}>
        <View style={styles.filterHeader}>
          <SearchBox
            style={styles.searchBox}
            onSearch={(text) => {
              debounceSearch(text);
            }}
          />
          <TouchableOpacity style={styles.filterBox}>
            <Icon name="filter" type="FontAwesome5" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterAdvanced}>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => {
              setFilter({ ...filter, is_done: filter.is_done ? 0 : 1 });
              doFilter("is_done", filter.is_done ? 0 : 1);
            }}
          >
            <Text style={styles.filterItemText}>
              {intl.formatMessage(Messages.done)}
            </Text>
            {filter.is_done ? (
              <Icon
                type="Ionicons"
                name="md-checkmark-circle"
                style={styles.childrenItemDone(filter.is_done)}
              />
            ) : (
              <Icon
                type="Ionicons"
                name="md-checkmark-circle-outline"
                style={styles.childrenItemDone(filter.is_done)}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openFilter("priority")}
            style={[
              styles.filterItem,
              {
                borderRightWidth: scale(10),
                borderLeftWidth: scale(10),
                borderColor: "#fff",
              },
            ]}
          >
            <Text style={styles.filterItemText}>
              {intl.formatMessage(Messages.priority)}
            </Text>
            {filter.prior_level == 4 ? (
              <Text style={{ ...defaultText, color: color.primary }}>
                {intl.formatMessage(Messages.all)}
              </Text>
            ) : (
              <View
                style={[
                  styles.childrenItemPriorLevel(filter.prior_level),
                  { marginRight: 0 },
                ]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openFilter("member")}
            style={styles.filterItem}
          >
            {renderAvatar()}
          </TouchableOpacity>
        </View>
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
            textAlign: "center",
          }}
        >
          {intl.formatMessage(Messages[tab.name])}
        </Text>
        {tab.data && tab.data.length > 0 ? (
          <View style={styles.dot}>
            <Text
              style={{
                ...defaultText,
                fontSize: fontSize.size20,
                fontWeight: "bold",
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
            style={{ marginTop: scale(20) }}
            contentContainerStyle={{ paddingBottom: scale(80) }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              renderItemTask(item, index, indexTab)
            }
            // onEndReached={() => loadMore(index)}
          />
        ) : (
          <EmptyData />
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

  const renderBtnAdd = () => {
    return (
      <View style={styles.actionButtonBox}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openCreatePopUp()}
        >
          <Icon name="plus" type="Entypo" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>
            {intl.formatMessage(Messages.add)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <HeaderInfo />
      {renderFilter()}
      {renderTabs()}
      {renderBtnAdd()}
      <CreateTask ref={createTaskRef} />
    </View>
  );
};

export default injectIntl(ListTask);
