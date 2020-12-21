import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
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
import { Icon, Tabs, Tab, ScrollableTab, Image } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import ActionButton from "react-native-action-button";
import BottomPopUp from "container/component/ui/bottomPopUp";

const AVATAR_SIZE = scale(60);

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
  const bottomPopUpRef = useRef(null);
  let pageTabs = [0];

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
    bottomPopUpRef.current.show();
  };

  //render
  const uiUser = [
    <Image
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      source={require("container/asset/icon/unassign-nhanvien.png")}
    />,
  ];

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
      <BottomPopUp
        ref={bottomPopUpRef}
        isUseKeyBoard
        height={scale(400)}
        animateToY={scale(-800)}
        limitAnimateY={scale(-500)}
        body={
          <View>
            <View style={styles.taskTypeWrapper}>
              <React.Fragment>
                <Icon
                  style={{
                    color: color.text,
                    fontSize: fontSize.size26,
                  }}
                  name="ios-lock"
                />
                <Text
                  style={{
                    ...defaultText,
                    fontSize: fontSize.size26,
                    marginLeft: scale(10),
                  }}
                >
                  quan que
                </Text>
              </React.Fragment>
            </View>
            <TextInput
              onChangeText={(text) => {}}
              autoFocus
              autoCorrect={false}
              maxLength={200}
              placeholder={intl.formatMessage(Messages.placeholder_task_name)}
              style={{
                fontSize: fontSize.size32,
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                // this.createTaskElem && this.createTaskElem.snapTo({ index: 0 });
                // this._descriptionText &&
                //   this._descriptionText.wrappedInstance &&
                //   this._descriptionText.wrappedInstance.focus();
              }}
            />
            <View style={styles.blockItem}>
              <TouchableOpacity style={styles.assignWrap} onPress={() => {}}>
                <View
                  style={{
                    width: AVATAR_SIZE,
                    paddingVertical: space.bgPadding,
                  }}
                >
                  {uiUser}
                </View>
                <View style={{ marginLeft: scale(15) }}>
                  <Text
                    style={{
                      ...defaultText,
                      fontSize: fontSize.size26,
                      color: color.text,
                    }}
                  >
                    {intl.formatMessage(Messages.assign_person)}
                  </Text>
                  {/* {dataGeneral.assigned_user &&
                  dataGeneral.assigned_user.name ? ( */}
                  <Text
                    style={{
                      ...defaultText,
                      fontSize: fontSize.size26,
                      fontWeight: "bold",
                    }}
                  >
                    {"Dai DAi"}
                  </Text>
                  {/* ) : null} */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                require
                onPress={this.openDueDatePicker}
                style={styles.dueDateWrap}
              >
                <Image
                  style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                  source={require("@src/assets/icons/unassign-hanchot.png")}
                />
                <View style={{ marginLeft: variables.scale(15) }}>
                  <Text font-size-22 color-secondary>
                    {intl.formatMessage(Messages.due_date)}
                  </Text>
                  {due_date ? (
                    <Text font-size-22 bold style={{ color: dueDateColor }}>
                      {moment(due_date, DUE_DATE_FORMAT).format(
                        intl.formatMessage(Messages.due_date_format)
                      )}
                    </Text>
                  ) : null}
                </View>
                <DatePicker
                  mode="date"
                  showIcon={false}
                  hideText={true}
                  androidMode="spinner"
                  ref={(ref) => (this.datePickerRef = ref)}
                  onDateChange={(date) => {
                    this.setState({ due_date: date });
                  }}
                  format={DUE_DATE_FORMAT}
                  confirmBtnText={intl
                    .formatMessage(Messages.confirm)
                    .toUpperCase()}
                  cancelBtnText={intl
                    .formatMessage(Messages.cancel)
                    .toUpperCase()}
                  style={{ width: 0 }}
                />
              </TouchableOpacity>
              {due_date ? (
                <TouchableOpacity
                  onPress={this.openDueTimePicker}
                  style={styles.dueDateWrap}
                >
                  <Image
                    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                    source={require("@src/assets/icons/dukien.png")}
                  />
                  <View style={{ marginLeft: variables.scale(15) }}>
                    <Text font-size-22 color-secondary>
                      {intl.formatMessage(Messages.due_time)}
                    </Text>
                    {due_time ? (
                      <Text font-size-22 bold style={{ color: dueDateColor }}>
                        {moment(due_time, DUE_TIME_FORMAT).format(
                          intl.formatMessage(Messages.due_time_format)
                        )}
                      </Text>
                    ) : null}
                  </View>
                  <DatePicker
                    mode="time"
                    showIcon={false}
                    hideText={true}
                    androidMode="spinner"
                    ref={(ref) => (this.timePickerRef = ref)}
                    onDateChange={(time) => {
                      this.setState({ due_time: time });
                    }}
                    format={DUE_TIME_FORMAT}
                    confirmBtnText={intl
                      .formatMessage(Messages.confirm)
                      .toUpperCase()}
                    cancelBtnText={intl
                      .formatMessage(Messages.cancel)
                      .toUpperCase()}
                    style={{ width: 0 }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {bundle ? (
              <TouchableOpacity
                onPress={this.gotoSelectStatus}
                disabled={
                  this.state.isEditTitle || this.state.isEditDescription
                }
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                {status ? (
                  <View
                    style={[
                      styles.priority,
                      {
                        backgroundColor: status ? status.color : "",
                      },
                    ]}
                  />
                ) : null}
                <Text color-secondary font-size-26>
                  {status
                    ? status.name
                    : intl.formatMessage(Messages.select_section)}
                </Text>
              </TouchableOpacity>
            ) : null}
            <View flex-row align-items-center>
              <Textarea
                ref={(ref) => (this._descriptionText = ref)}
                autoCorrect={false}
                onChangeText={(text) => this.setState({ description: text })}
                rowSpan={3}
                placeholder={intl.formatMessage(Messages.description)}
                placeholderTextColor={variables.textColorSecondary}
                style={{
                  flex: 1,
                  marginTop: variables.scale(15),
                  paddingLeft: 0,
                }}
              />
            </View>
          </View>
        }
        toolbar={() => (
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.textCreateButton}>
              {intl.formatMessage(Messages.create)}
            </Text>
          </TouchableOpacity>
        )}
      />
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
  actionButtonIcon: {
    fontSize: 25,
    color: "#fff",
  },
  createButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    alignSelf: "flex-end",
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    ...defaultText,
    color: "#fff",
  },
  taskTypeWrapper: {
    flexDirection: "row",
    marginBottom: space.bgPadding,
    alignItems: "center",
  },
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateWrap: {
    marginLeft: scale(50),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default injectIntl(ListTask);
