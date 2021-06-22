import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import SearchBox from "container/component/ui/searchBox";
import { scale, color, fontSize, space } from "container/variables/common";
import { styles, AVATAR_SIZE } from "../style/list";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listTaskState, currTaskState } from "../recoil";
import { Icon, Tabs, Tab, ScrollableTab, CheckBox } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { getRequest, postRequest } from "container/utils/request";
import HeaderInfo from "../ui/HeaderInfo";
import ModalContext from "container/context/modal";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import { repairParams } from "container/helper/format";
import { PRIORITY_LEVEL } from "container/constant/element";
import Avatar from "container/component/ui/avatar";
import EmptyData from "container/component/ui/emptyData";
import SelectModal from "container/component/ui/selectModal";
import LabelSelectModal from "../ui/labelSelectModal";
import Collapsible from "react-native-collapsible";

const TODAY = 0,
  FUTURE = 1,
  TIMED = 2,
  NO_TIME = 3;

const PRIOR_LEVEL_ALL = 4;

const DEFAULT_FILTER = {
  is_done: 0,
  user_ids: [],
  prior_level: PRIOR_LEVEL_ALL,
  dynamic: [],
  visible: false,
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
  const selectLabelRef = useRef(null);
  const debounceSearch = useRef(debounce((text) => doFilter("name", text), 200))
    .current;

  //effect
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

  const toggleFilter = () => {
    const value = filter.visible;
    setFilter(update(filter, { visible: { $set: !value } }));
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
        switch (i.type) {
          case "event":
            cloneFilter.by_event = 1;
            cloneFilter.event_id = i.data.id;
            break;
          case "label":
            cloneFilter.label_ids = i.data.map((item) => item.id);
            break;
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
        onPress: () => showEventSelectModal(),
      },
      {
        title: intl.formatMessage(Messages.label),
        onPress: () => showLabelSelectModal(),
      },
      {
        title: intl.formatMessage(Messages.cancel),
        type: "danger",
      },
    ];

    showActionSheet({ actions });
  };

  const showEventSelectModal = () => {
    selectEventRef.current && selectEventRef.current.show();
  };

  const showLabelSelectModal = () => {
    if (selectLabelRef.current) {
      const objFilter = filter.dynamic.find((i) => i.type == "label");
      const selectedValues = objFilter && objFilter.data ? objFilter.data : [];

      selectLabelRef.current.show(selectedValues);
    }
  };

  const deleteDynamicFilter = (index) => {
    setFilter(update(filter, { dynamic: { $splice: [[index, 1]] } }));
  };

  const addDynamicFilter = (type, value) => {
    const indexFilter = filter.dynamic.findIndex((i) => i.type == type);
    const isHasFiltered = indexFilter >= 0;
    if (isHasFiltered) {
      setFilter(
        update(filter, {
          dynamic: { [indexFilter]: { data: { $set: value } } },
        })
      );
    } else {
      const transformObj = {
        type,
        data: value,
      };
      setFilter(update(filter, { dynamic: { $push: [transformObj] } }));
    }
  };

  const openDynamicFilterModal = (type) => {
    switch (type) {
      case "event":
        showEventSelectModal();
        break;
      case "label":
        showLabelSelectModal();
        break;
    }
  };

  const onRefresh = () => {
    console.log('onRefresh:::')
    doFilter();
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
          <Avatar noShadow size={AVATAR_SIZE} data={filter.user_ids[0]} />
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
                  noShadow
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
              noShadow
              style={[
                styles.contentMemAvt,
                {
                  right:
                    (filter.user_ids.length - 1 - index) *
                    ((2 * AVATAR_SIZE) / 3),
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
    const hasFiltered =
      filter.prior_level != PRIOR_LEVEL_ALL ||
      filter.is_done != 0 ||
      filter.user_ids.length ||
      filter.dynamic.length;

    return (
      <View style={styles.filter}>
        <View style={styles.filterHeader}>
          <SearchBox
            style={styles.searchBox}
            onSearch={(text) => {
              debounceSearch(text);
            }}
          />
          <TouchableOpacity
            onPress={() => toggleFilter()}
            style={styles.filterBox}
          >
            <Icon name="filter" type="FontAwesome5" style={styles.filterIcon} />
            {hasFiltered ? <View style={styles.filteredDot} /> : null}
          </TouchableOpacity>
        </View>
        <Collapsible collapsed={!filter.visible}>
          <View style={styles.filterAdvanced}>
            {renderStaticFilter()}
            {renderDynamicFilter()}
          </View>
        </Collapsible>
      </View>
    );
  };

  const renderStaticFilter = () => {
    return (
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
            <Text style={{ color: color.primary }}>
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
    );
  };

  const renderDynamicFilter = () => {
    return (
      <View style={styles.dynamicFilterList}>
        {filter.dynamic.map((item, indexFilter) =>
          renderItemDynamicFilter(item, indexFilter)
        )}
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
    );
  };

  const renderItemDynamicFilter = (item, indexFilter) => {
    const transformValue =
      item.type == "label" ? (
        transformLabelValue(item.data)
      ) : item.data && item.data.name ? (
        <Text>{item.data.name}</Text>
      ) : (
        <Text>{intl.formatMessage(Messages.all)}</Text>
      );

    return (
      <TouchableOpacity
        onPress={() => openDynamicFilterModal(item.type)}
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
          {transformValue}
          <TouchableOpacity
            style={{
              paddingVertical: space.itemMargin,
              paddingHorizontal: space.componentMargin,
            }}
            onPress={() => deleteDynamicFilter(indexFilter)}
          >
            <Icon
              name="close"
              type="FontAwesome"
              style={styles.dynamicFilterIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const transformLabelValue = (labels) => {
    return (
      <View style={styles.labelBox}>
        {labels.length
          ? labels.map((item) => (
              <View style={styles.labelItem(item.color)}>
                <Text style={styles.labelItemText}>{item.title}</Text>
              </View>
            ))
          : null}
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
            style={{ marginTop: scale(20), backgroundColor: "#fff" }}
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

  const renderModal = () => {
    const selectedEvent = filter.dynamic.find((i) => i.type == "event");

    return (
      <React.Fragment>
        <SelectModal
          type="list"
          ref={selectMemberRef}
          key={"select_member"}
          onDone={(value) => {
            console.log("onDoneFilter::::", value);

            if (value) {
              setFilter(update(filter, { user_ids: { $set: value } }));
              doFilter(
                "user_ids",
                value.map((item) => item.id)
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
          onDone={(value) => addDynamicFilter("event", value)}
          selectedData={
            selectedEvent && selectedEvent.data ? selectedEvent.data : null
          }
        />
        <LabelSelectModal
          ref={selectLabelRef}
          onDone={(labels) => addDynamicFilter("label", labels)}
        />
      </React.Fragment>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <HeaderInfo onRefresh={() => onRefresh()} />
      {renderFilter()}
      {renderTabs()}
      {renderModal()}
    </View>
  );
};

export default injectIntl(ListTask);
