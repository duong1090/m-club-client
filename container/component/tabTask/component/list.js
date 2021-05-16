import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import SearchBox from "container/component/ui/searchBox";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
} from "container/variables/common";

import { styles, AVATAR_SIZE } from "../style/list";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listTaskState, currTaskState } from "../recoil";
import { Icon, Tabs, Tab, ScrollableTab, CheckBox } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import HeaderInfo from "../ui/HeaderInfo";
import ModalContext from "container/context/modal";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import { repairParams } from "container/helper/format";
import { gotoRoute } from "container/utils/router";
import { modals, screens } from "container/constant/screen";
import { PRIORITY_LEVEL } from "container/constant/element";
import Avatar from "container/component/ui/avatar";
import EmptyData from "container/component/ui/emptyData";
import SelectModal from "container/component/ui/selectModal";

const TODAY = 0,
  FUTURE = 1,
  TIMED = 2,
  NO_TIME = 3;

const DEFAULT_FILTER = {
  is_done: 0,
  user_ids: [],
  prior_level: 4,
  dynamic: [],
};

const ListTask = (props) => {
  //props
  const { style, intl, openDetail } = props;
  //state
  const [data, setData] = useRecoilState(listTaskState);
  const setCurrTask = useSetRecoilState(currTaskState);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  //context
  const { showSpinner, hideSpinner, showActionSheet } = useContext(
    ModalContext
  );

  //variables
  const selectMemberRef = useRef(null);
  const selectPriorityRef = useRef(null);
  const selectEventRef = useRef(null);
  const debounceSearch = useRef(debounce((text) => doFilter("name", text), 200))
    .current;

  //effect
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    doFilter("dynamic");
  }, [filter.dynamic]);

  //function - event -----------------------------------------------------------------------------------------------------------------------

  const getData = () => {
    showSpinner();
    getRequest("task/get")
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
    openDetail && openDetail(item);
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
    postRequest("task/update-task-status", params).then((res) => {
      if (res) {
      }
    });
    setData(
      update(data, {
        [indexTab]: { data: { [index]: { is_done: { $set: !isDone } } } },
      })
    );
  };

  const openFilter = (type) => {
    if (type == "priority")
      selectPriorityRef && selectPriorityRef.current.show();
    else if (type == "member")
      selectMemberRef && selectMemberRef.current.show();
  };

  const doFilter = (type = "name", value) => {
    showSpinner();
    let params = {};
    if (type == "dynamic") {
      const cloneFilter = { ...filter };
      filter.dynamic.map((i) => {
        if (i.type == "event") {
          cloneFilter.by_event = 1;
          if (i.id && i.id != `all_event`) cloneFilter.event_id = i.id;
        }
      });

      delete cloneFilter.dynamic;

      params = repairParams({ ...cloneFilter });
    } else if (value || value == 0)
      params = repairParams({ ...filter, [type]: value });
    else params = repairParams({ ...filter });

    getRequest("task/get".concat(`?${params}`))
      .then((res) => {
        if (res && res.data) getDataSuccess(res);
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const openSelectFilterOption = () => {
    const actions = [
      {
        title: intl.formatMessage(Messages.event),
        onPress: () => {
          selectEventRef.current && selectEventRef.current.show();
        },
      },
      {
        title: intl.formatMessage(Messages.cancel),
        type: "danger",
      },
    ];

    showActionSheet({ actions });
  };

  const changeDynamicFilter = (action = null, type = null, value) => {
    const index = filter.dynamic.findIndex((i) => i.id == value.id);
    const indexAllValue = filter.dynamic.findIndex(
      (i) => i.id == `all_${type}`
    );

    console.log("changeDynamicFilter:::", indexAllValue, filter.dynamic, value);

    switch (action) {
      case "add":
        if (indexAllValue >= 0) {
          if (value && index < 0) {
            const transformValue = { ...value, type };
            setFilter(
              update(filter, {
                dynamic: {
                  $push: [transformValue],
                  $splice: [[indexAllValue, 1]],
                },
              })
            );
          }
        } else {
          if (value != null && value != []) {
            const all = {
              type,
              id: `all_${type}`,
            };

            const tempFilter = { ...filter };

            tempFilter.dynamic.map((i, index) => {
              console.log("checkFilterNE", i, index, type, i.type == type);

              if (i.type == type)
                setFilter(
                  update(filter, {
                    dynamic: {
                      $splice: [[index, 1]],
                    },
                  })
                );
            });

            setFilter(
              update(filter, {
                dynamic: {
                  $push: [all],
                },
              })
            );
          } else if (index < 0) {
            const transformValue = { ...value, type };
            setFilter(update(filter, { dynamic: { $push: [transformValue] } }));
          }
        }
        break;
      case "remove":
        if (index >= 0)
          setFilter(update(filter, { dynamic: { $splice: [[index, 1]] } }));
    }
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
          <View style={styles.filterWrapper}>
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
                  borderRightWidth: scale(5),
                  borderLeftWidth: scale(5),
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

          <View style={styles.dynamicFilterList}>
            {filter.dynamic.map((item) => (
              <View
                style={[
                  styles.filterWrapper,
                  {
                    justifyContent: "space-between",
                    marginBottom: scale(10),
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: space.itemMargin,
                    marginHorizontal: space.componentMargin,
                  }}
                >
                  <View style={styles.dynamicFilterDot} />
                  <Text style={styles.dynamicFilterText}>
                    {intl.formatMessage(Messages[item.type])}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>
                    {item.name ? item.name : intl.formatMessage(Messages.all)}
                  </Text>
                  <TouchableOpacity
                    style={{
                      paddingVertical: space.itemMargin,
                      paddingHorizontal: space.componentMargin,
                    }}
                    onPress={() => changeDynamicFilter("remove", "event", item)}
                  >
                    <Icon
                      name="close"
                      type="FontAwesome"
                      style={styles.dynamicFilterIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.dynamicFilterBtn}
              onPress={() => openSelectFilterOption()}
            >
              <Icon
                name="plus"
                type="Entypo"
                style={{ fontSize: scale(30), color: color.blue }}
              />
              <Text style={[styles.dynamicFilterText, { color: color.blue }]}>
                {intl.formatMessage(Messages.add_filter)}
              </Text>
            </TouchableOpacity>
          </View>
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

  return (
    <View style={[styles.container, style]}>
      <HeaderInfo />
      {renderFilter()}
      {renderTabs()}
      <SelectModal
        type="list"
        ref={selectMemberRef}
        key={"select_member"}
        onDone={(value) => {
          if (value) {
            let temp = { ...filter };
            temp.user_ids = value;
            setFilter(temp);
            doFilter(
              "user_ids",
              temp.user_ids.map((item) => item.id)
            );
          }
        }}
        selectedData={filter.user_ids}
        api="member/get"
        params={{ type: "simple" }}
        multiSelect={true}
        isMember={true}
      />
      <SelectModal
        type="list"
        ref={selectPriorityRef}
        key={"select_priority"}
        externalData={PRIORITY_LEVEL.map((item) => {
          return { ...item, name: intl.formatMessage(Messages[item.name]) };
        })}
        onDone={(value) => {
          if (value) {
            let temp = { ...filter };
            temp.prior_level = value.id;
            setFilter(temp);
            doFilter("prior_level", value.id);
          }
        }}
        selectedData={PRIORITY_LEVEL[filter.prior_level]}
      />
      <SelectModal
        type="list"
        ref={selectEventRef}
        key={"select_event"}
        api="event/get"
        onDone={(value) => changeDynamicFilter("add", "event", value)}
      />
    </View>
  );
};

export default injectIntl(ListTask);
