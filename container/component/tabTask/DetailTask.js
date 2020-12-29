import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles, AVATAR_SIZE } from "./style/create";
import { Icon } from "native-base";
import HeaderInfo from "./HeaderInfo";
import Avatar from "container/component/ui/avatar";
import Config from "container/config/server.config";
import { getRequest, postRequest } from "container/utils/request";
import { useRecoilState } from "recoil";
import { listTaskState, currTaskState } from "container/recoil/state/tabTask";
import { showSpinner, hideSpinner } from "container/utils/router";
import { highlighText } from "container/helper/format";
import { gotoRoute } from "container/utils/router";
import { modals } from "container/constant/screen";
import moment from "moment";
import { injectIntl } from "react-intl";
import update from "immutability-helper";
import Messages from "container/translation/Message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalPopUp from "container/component/ui/modalPopUp";
import CreateTask from "./CreateTask";
import { scale } from "../../variables/common";

const PRIORITY_LEVEL = [
  { id: 0, name: "Thấp" },
  { id: 1, name: "Vừa" },
  { id: 2, name: "Cao" },
];
const UPDATE_API = {
  member: "task/update-assigned-member",
  name: "task/update-task-name",
  deadline: "task/update-task-dealine",
  priority: "task/update-task-prior",
  isDone: "task/update-task-status",
};
const TASK_TABS = ["today", "future", "timed", "no_time"];

const DetailTask = (props) => {
  //props
  const { style, intl, changeMode } = props;
  //state
  const [name, setName] = useState(null);
  const [member, setMember] = useState([]);
  const [priorityLevel, setPriorityLevel] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [description, setDescription] = useState(null);
  const [children, setChildren] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [visibleActivity, setVisibleActivity] = useState(false);
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);
  const [currTask, setCurrTask] = useRecoilState(currTaskState);
  const [listTask, setListTask] = useRecoilState(listTaskState);

  //variables
  const createTaskRef = useRef(null);
  const updateMethod = {
    member: setMember,
    name: setName,
    deadline: setDeadline,
    priority: setPriorityLevel,
    isDone: setIsDone,
  };

  //effect -------------------------------------------------------------------------------
  useEffect(() => {
    if (currTask && currTask.id) getData();
  }, [currTask]);

  //function - event ---------------------------------------------------------------------
  const openCreatePopUp = () => {
    createTaskRef.current.show();
  };

  const getData = () => {
    showSpinner();
    getRequest(Config.API_URL.concat("task/detail"), { id: currTask.id })
      .then((res) => {
        if (res && res.data) {
          console.log("getDetailTask:::", res.data);
          setName(res.data.name);
          setMember(res.data.assigned_mems);
          setDeadline(res.data.end_date);
          setDescription(res.data.description);
          setChildren(res.data.child_tasks);
          setActivities(res.data.logs);
          setPriorityLevel(res.data.prior_level);
          setIsDone(res.data.is_done ? true : false);
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
      });
  };

  const updateTask = (field, extraParams) => {
    showSpinner();
    let params = {
      ...extraParams,
    };
    if (currTask && currTask.id) params.id = currTask.id;
    postRequest(Config.API_URL.concat(UPDATE_API[field]), params)
      .then((res) => {
        if (res) updateMethod[field](res.data);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
      });
  };

  const gotoSelectMember = () => {
    let passProps = {
      onSelectItem: (value) => {
        updateTask("member", {
          assigned_member_ids: value.map((item) => item.id),
        });
      },
      selectedItem: member,
      api: "member/get",
      params: { type: "simple" },
      multiSelect: true,
      isMember: true,
    };
    gotoRoute(modals.SELECT_MODAL, passProps, true);
  };

  const gotoSelectPriority = () => {
    let passProps = {
      data: PRIORITY_LEVEL,
      onSelectItem: (value) => {
        updateTask("priority", { prior_level: value.id });
      },
    };
    gotoRoute(modals.SELECT_MODAL, passProps, true);
  };

  const confirmPickTime = (date) => {
    setVisibleTimePicker(false);
    updateTask("deadline", {
      end_date: moment(date).format(
        intl.formatMessage(Messages.datetime_format)
      ),
    });
  };

  const onDelete = () => {
    showSpinner();
    let params = {};
    if (currTask && currTask.id) params.id = currTask.id;
    postRequest(Config.API_URL.concat("task/delete"), params)
      .then((res) => {
        if (res && res.data) {
          changeMode && changeMode("list");

          //update list
          let indexOf = listTask[currTask.indexTab].findIndex(
            (item) => item.id == currTask.id
          );
          if (indexOf >= 0)
            setListTask(update(listTask), {
              [currTask.indexTab]: { $splice: [[indexOf, 1]] },
            });
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
      });
  };

  //render -----------------------------------------------------------------------------
  const renderAvatar = () => {
    const limit = 3;
    if (member.length == 1) {
      return (
        <TouchableOpacity
          onPress={() => gotoSelectMember()}
          style={styles.contentMemAvtBox}
        >
          <Text numberOfLines={2} style={styles.contentMemName}>
            {member[0].name}
          </Text>
          <Avatar size={AVATAR_SIZE} data={member[0]} />
        </TouchableOpacity>
      );
    } else if (member.length > limit)
      return (
        <TouchableOpacity
          onPress={() => gotoSelectMember()}
          style={styles.contentMemAvtBox}
        >
          {[...Array(limit + 1).keys()].map((item, index) => {
            if (index >= limit)
              return (
                <View
                  style={[
                    styles.contentMemAvtMore,
                    styles.contentMemAvt,
                    { right: (index - limit) * (AVATAR_SIZE / 2) },
                  ]}
                >
                  <Text style={styles.contentMemAvtMoreText}>
                    {`+${member.length - limit}`}
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
                  data={member[index]}
                />
              );
          })}
        </TouchableOpacity>
      );
    else if (member.length == 0) {
      return (
        <TouchableOpacity
          onPress={() => gotoSelectMember()}
          style={styles.contentMemAdd}
        >
          <Icon name="add" style={styles.contentMemAddIcon} />
        </TouchableOpacity>
      );
    } else
      return (
        <TouchableOpacity
          onPress={() => gotoSelectMember()}
          style={styles.contentMemAvtBox}
        >
          {member.map((item, index) => (
            <Avatar
              style={[
                styles.contentMemAvt,
                { right: (member.length - 1 - index) * (AVATAR_SIZE / 2) },
              ]}
              size={AVATAR_SIZE}
              data={item}
            />
          ))}
        </TouchableOpacity>
      );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <View style={styles.contentChild}>
          <Text style={styles.contentChildText}>Công việc con của </Text>
          <Text style={styles.contentChildTask}>Sự kiện 20/11</Text>
        </View>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{name}</Text>
        </View>
        <View style={styles.contentBody}>
          <View style={styles.contentMem}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentMemText}>Người thực hiện</Text>
            </View>
            {renderAvatar()}
          </View>
          <View style={styles.contentPriority}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentPriorityText}>Độ ưu tiên</Text>
            </View>
            <TouchableOpacity
              onPress={() => gotoSelectPriority()}
              style={styles.contentPriorityBox(priorityLevel)}
            >
              <Text style={styles.contentPriorityLevel}>
                {PRIORITY_LEVEL[priorityLevel].name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentDeadline}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentDeadlineText}>Han chot</Text>
            </View>
            <TouchableOpacity
              onPress={() => setVisibleTimePicker(true)}
              style={styles.contentDeadlineBox}
            >
              <Text style={styles.contentDeadlineTime}>{deadline}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              mode="datetime"
              isVisible={visibleTimePicker}
              onConfirm={(date) => confirmPickTime(date)}
              onCancel={() => setVisibleTimePicker(false)}
            />
          </View>
        </View>
        <Text style={styles.contentDescription}>{description}</Text>
      </View>
    );
  };

  const renderItemChildren = (item) => (
    <View style={styles.childrenItem}>
      <View style={styles.childrenItemHeader}>
        <View style={styles.childrenItemPriorLevel(item.priority_level)} />
        <Text numberOfLines={1}>{item.name}</Text>
      </View>
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
    </View>
  );

  const renderChildren = () => {
    return (
      <View style={styles.children}>
        <View style={styles.childrenHeader}>
          <View style={styles.childrenTitleBox}>
            <View style={styles.dot} />
            <Text style={styles.childrenTitle}>Công việc con</Text>
          </View>
          <TouchableOpacity
            onPress={() => openCreatePopUp()}
            style={styles.childrenTitleBox}
          >
            <Icon
              name="pen"
              type="FontAwesome5"
              style={styles.childrenCreateIcon}
            />
            <Text style={styles.childrenCreateText}>Tạo mới</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={children}
          renderItem={({ item }) => renderItemChildren(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const renderActivityItem = (item) => {
    const text = highlighText(item.name, item.objects, styles.activityItemName);

    return (
      <View style={styles.activityItem}>
        <Text numberOfLines={2} style={styles.activityItemName}>
          {text}
        </Text>
        <View style={styles.activityItemTime}>
          <Text numberOfLines={2} style={styles.activityItemTimeText}>
            {item.time}
          </Text>
          <Icon
            name="clockcircle"
            type="AntDesign"
            style={styles.activityItemTimeIcon}
          />
        </View>
      </View>
    );
  };

  const renderActivity = () => {
    return (
      <ModalPopUp
        title="Nhật kí hoạt động"
        visible={visibleActivity}
        transparent
        animationType="fade"
        maskClose={() => {
          setVisibleActivity(false);
        }}
        onClose={() => {
          setVisibleActivity(false);
        }}
        width="90%"
        height="80%"
      >
        <View style={styles.activityModal}>
          <FlatList
            style={styles.activityList}
            data={activities}
            renderItem={({ item }) => renderActivityItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ModalPopUp>
    );
  };

  const renderButtonDelete = () => {
    return (
      <View style={styles.contentDelete}>
        <TouchableOpacity
          onPress={() => onDelete()}
          style={styles.contentBtnDelete}
        >
          <Icon
            type="FontAwesome5"
            name="trash"
            style={styles.contentDeleteIcon}
          />
          <Text style={styles.textDelete}>
            {intl.formatMessage(Messages.delete)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={{ paddingBottom: scale(70) }}
      >
        <HeaderInfo />
        {renderContent()}
        {renderChildren()}
        {renderButtonDelete()}
        {renderActivity()}
      </ScrollView>
      <View style={styles.activityButtonBox}>
        <TouchableOpacity
          onPress={() => setVisibleActivity(true)}
          style={styles.activityButton}
        >
          <Icon
            type="FontAwesome5"
            name="book"
            style={styles.activityButtonIcon}
          />
          <Text style={styles.activityButtonText}>Nhật ký hoạt động</Text>
        </TouchableOpacity>
      </View>
      <CreateTask
        ref={createTaskRef}
        data={currTask}
        callbackCreate={(value) => {
          let temp = [...children];
          temp.push(value);
          setChildren(temp);
        }}
      />
    </View>
  );
};

export default injectIntl(DetailTask);
