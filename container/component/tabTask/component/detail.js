import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles, AVATAR_SIZE } from "../style/detail";
import { Icon } from "native-base";
import Avatar from "container/component/ui/avatar";
import { getRequest, postRequest } from "container/utils/request";
import { useRecoilState } from "recoil";
import { listTaskState, currTaskState } from "../recoil";
import ModalContext from "container/context/modal";
import { highlighText } from "container/helper/format";
import { getHumanDay } from "container/helper/time";
import moment from "moment";
import { getIntl } from "container/utils/common";
import update from "immutability-helper";
import Messages from "container/translation/Message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalPopUp from "container/component/ui/modalPopUp";
import CreateTask from "./create";
import { scale, space } from "../../../variables/common";
import { PRIORITY_LEVEL } from "container/constant/element";
import { back } from "container/utils/router";
import SelectModal from "container/component/ui/selectModal";
import LabelSelectModal from "../ui/labelSelectModal";
import Modal from "react-native-modal";

const UPDATE_API = {
  member: "task/update-assigned-member",
  name: "task/update-task-name",
  deadline: "task/update-task-dealine",
  prior_level: "task/update-task-prior",
  is_done: "task/update-task-status",
  label: "task/update-label",
};
const INDEX_LIST = { today: 0, future: 1, timed: 2, no_time: 3 };

const intl = getIntl();

const DetailTask = (props, ref) => {
  //props
  const { style, setListTask, listTask } = props;
  //state
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(null);
  const [parent, setParent] = useState(null);
  const [member, setMember] = useState([]);
  const [priorityLevel, setPriorityLevel] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [description, setDescription] = useState(null);
  const [children, setChildren] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [label, setLabel] = useState([]);
  const [visibleActivity, setVisibleActivity] = useState(false);
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);
  const [visibleNameIcon, setVisibleNameIcon] = useState(true);
  const [visibleDesIcon, setVisibleDesIcon] = useState(true);
  const [currTask, setCurrTask] = useRecoilState(currTaskState);
  // const [listTask, setListTask] = useRecoilState(listTaskState);

  //context
  const { showSpinner, hideSpinner, showConfirmModal } = useContext(
    ModalContext
  );

  //variables
  const createTaskRef = useRef(null);
  const nameInputRef = useRef(null);
  const desInputRef = useRef(null);
  const selectMemberRef = useRef(null);
  const selectPriorityRef = useRef(null);
  const selectLabelRef = useRef(null);
  const updateMethod = {
    member: setMember,
    name: setName,
    deadline: setDeadline,
    prior_level: setPriorityLevel,
    is_done: setIsDone,
    label: setLabel,
  };

  //effect -------------------------------------------------------------------------------
  useEffect(() => {
    if (currTask && currTask.id) getData(currTask);
  }, [currTask]);

  //pass data from another component
  useEffect(() => {
    if (props.data) setCurrTask(props.data);
  }, [props.data]);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event ---------------------------------------------------------------------
  const show = (data) => {
    setVisible(true);
    if (data && data.id) setCurrTask(data);
  };

  const hide = () => {
    setVisible(false);
  };

  const openCreatePopUp = () => {
    createTaskRef.current.show();
  };

  const resetState = () => {
    setName(null);
    setMember([]);
    setPriorityLevel(0);
    setDeadline(null);
    setDescription(null);
    setChildren([]);
    setActivities([]);
    setIsDone(false);
    setVisibleActivity(false);
    setVisibleTimePicker(false);
    setVisibleNameIcon(true);
    setVisibleDesIcon(true);
  };

  const getData = () => {
    showSpinner();
    getRequest("task/detail", { id: currTask.id })
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
          setParent(res.data.parent ? res.data.parent : null);
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
      });
  };

  const updateTask = (field, extraParams) => {
    console.log("updateTask:::", field, extraParams);
    showSpinner();
    let params = {};
    if (currTask && currTask.id) params.id = currTask.id;
    postRequest(UPDATE_API[field], {
      ...params,
      ...extraParams,
    })
      .then((res) => {
        if (res) {
          updateMethod[field](res.data);
          //update list
          // let taskIndex = listTask[INDEX_LIST[currTask.group]].data.findIndex(
          //   (item) => item.id == currTask.id
          // );
          console.log("updateTask::::", listTask);
          setListTask &&
            listTask &&
            setListTask(
              update(listTask, {
                [INDEX_LIST[currTask.group]]: {
                  data: { [currTask.index]: { [field]: { $set: res.data } } },
                },
              })
            );
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const gotoSelectMember = () => {
    selectMemberRef && selectMemberRef.current.show();
  };

  const gotoSelectPriority = () => {
    selectPriorityRef && selectPriorityRef.current.show();
  };

  const confirmPickTime = (date) => {
    console.log("confirmPickTime:::", date);
    setVisibleTimePicker(false);
    updateTask("deadline", {
      end_date: moment(date).format("YYYY-MM-DD HH:mm"),
    });
  };

  const confirmDelete = () => {
    const options = {
      onOk: () => onDelete(),
      content: intl.formatMessage(Messages.are_you_sure_to_delete),
    };

    showConfirmModal(options);
  };

  const onDelete = () => {
    showSpinner();
    let params = {};
    if (currTask && currTask.id) params.id = currTask.id;
    postRequest("task/delete", params)
      .then((res) => {
        if (res && res.data) {
          // changeMode && changeMode("list");
          back();
          resetState();

          //update list
          const currArrTask = listTask[INDEX_LIST[currTask.group]];
          const currIndex = currArrTask.data.findIndex(
            (i) => i.id == currTask.id
          );

          setListTask(
            update(listTask, {
              [INDEX_LIST[currTask.group]]: {
                data: { $splice: [[currIndex, 1]] },
              },
            })
          );
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
      });
  };

  const onBlurName = () => {
    updateTask("name", {
      name,
    });
    setVisibleNameIcon(true);
  };

  const onBlurDescription = () => {
    updateTask("description", {
      description,
    });
    setVisibleDesIcon(true);
  };

  const onDone = () => {
    updateTask("is_done", {
      is_done: isDone ? 0 : 1,
    });
    setIsDone(!isDone);
  };

  const checkDoneChildTask = (item, index) => {
    const childDone = children[index] && children[index].is_done ? 1 : 0;
    updateTask("isDone", {
      id: item.id,
      is_done: childDone ? 0 : 1,
    });
    setChildren(
      update(children, { [index]: { is_done: { $set: childDone ? 0 : 1 } } })
    );
  };

  const gotoChildTask = (item) => {
    setCurrTask(item);
  };

  const gotoParentTask = (item) => {
    setCurrTask(item);
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
          <Avatar size={AVATAR_SIZE} data={member[0]} noShadow />
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
          <Icon name="plus" type="Feather" style={styles.contentMemAddIcon} />
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

  const renderName = () => {
    return (
      <View style={styles.contentHeader}>
        <TextInput
          style={styles.contentTitle}
          value={name}
          ref={nameInputRef}
          multiline
          onChangeText={(text) => setName(text)}
          onBlur={() => onBlurName()}
          onFocus={() => setVisibleNameIcon(false)}
        />
        {visibleNameIcon ? (
          <TouchableOpacity
            onPress={() => {
              nameInputRef && nameInputRef.current.focus();
              setVisibleNameIcon(false);
            }}
          >
            <Icon
              type="FontAwesome5"
              name="pen"
              style={styles.contentTitleIcon}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.editBox} />
        )}
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View style={styles.contentDescriptionBox}>
        <TextInput
          style={styles.contentDescriptionText}
          value={description && description != "" ? description : null}
          placeholder={intl.formatMessage(Messages.description)}
          ref={desInputRef}
          multiline
          onChangeText={(text) => setDescription(text)}
          onBlur={() => onBlurDescription()}
          onFocus={() => setVisibleDesIcon(false)}
        />
        {visibleDesIcon ? (
          <TouchableOpacity
            onPress={() => {
              desInputRef && desInputRef.current.focus();
              setVisibleDesIcon(false);
            }}
          >
            <Icon
              type="FontAwesome5"
              name="pen"
              style={styles.contentTitleIcon}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.editBox} />
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>
        {parent ? (
          <TouchableOpacity
            onPress={() => gotoParentTask(parent)}
            style={styles.contentChild}
          >
            <Text style={styles.contentChildText}>
              {intl.formatMessage(Messages.child_task_of)}
            </Text>
            <Text style={styles.contentChildTask}>{parent.name}</Text>
          </TouchableOpacity>
        ) : null}
        {renderName()}
        <View style={styles.contentBody}>
          <View style={styles.contentMem}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentMemText}>
                {intl.formatMessage(Messages.assigned_member)}
              </Text>
            </View>
            {renderAvatar()}
          </View>
          <View style={styles.contentPriority}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentPriorityText}>
                {intl.formatMessage(Messages.priority)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => gotoSelectPriority()}
              style={styles.contentPriorityBox(priorityLevel)}
            >
              <Text style={styles.contentPriorityLevel(priorityLevel)}>
                {intl.formatMessage(
                  Messages[PRIORITY_LEVEL[priorityLevel].name]
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentDeadline}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentDeadlineText}>
                {intl.formatMessage(Messages.deadline)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVisibleTimePicker(true)}
              style={styles.contentDeadlineBox}
            >
              <Text style={styles.contentDeadlineTime(deadline)}>
                {deadline
                  ? deadline
                  : intl.formatMessage(Messages.set_deadline)}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              mode="datetime"
              isVisible={visibleTimePicker}
              onConfirm={(date) => confirmPickTime(date)}
              onCancel={() => setVisibleTimePicker(false)}
            />
          </View>

          <View style={styles.contentLabel}>
            <View style={styles.rowView}>
              <View style={styles.dot} />
              <Text style={styles.contentLabelText}>
                {intl.formatMessage(Messages.label)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => selectLabelRef.current.show()}
              style={styles.contentLabelBox}
            >
              {label.length ? (
                renderLabel()
              ) : (
                <Text style={styles.contentLabelDetail}>
                  {intl.formatMessage(Messages.select_title, {
                    title: intl.formatMessage(Messages.label).toLowerCase(),
                  })}
                </Text>
              )}
            </TouchableOpacity>
            <LabelSelectModal
              ref={selectLabelRef}
              onDone={(labels) => {
                if (labels) {
                  updateTask("label", {
                    label_ids: labels.map((item) => item.id),
                  });
                }
              }}
            />
          </View>
        </View>
        {renderDescription()}
      </View>
    );
  };

  const renderLabel = () => {
    return (
      <View style={styles.labelBox}>
        {label.map((item) => (
          <View style={styles.labelItem(item.color)}>
            <Text style={styles.labelItemText}>{item.title}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderItemChildren = (item, index) => (
    <View
      style={[
        styles.childrenItem,
        index > 0
          ? {
              borderTopWidth: scale(1),
            }
          : null,
      ]}
    >
      <TouchableOpacity
        onPress={() => gotoChildTask(item)}
        style={styles.childrenItemHeader}
      >
        <View style={styles.childrenItemPriorLevel(item.prior_level)} />
        <Text numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => checkDoneChildTask(item, index)}
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

  const renderItemChildrenEmpty = () => {
    return (
      <TouchableOpacity
        onPress={() => openCreatePopUp()}
        style={styles.childrenEmpty}
      >
        <View style={styles.childrenEmptyButton}>
          <Icon name="plus" type="Feather" style={styles.childrenEmptyIcon} />
        </View>
        <Text style={styles.childrenEmptyText}>
          {intl.formatMessage(Messages.add)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderChildren = () => {
    return (
      <View style={styles.children}>
        <View style={styles.childrenHeader}>
          <View style={styles.childrenTitleBox}>
            <View style={styles.dot} />
            <Text style={styles.childrenTitle}>
              {intl.formatMessage(Messages.child_task)}
            </Text>
          </View>
          {children.length ? (
            <TouchableOpacity
              onPress={() => openCreatePopUp()}
              style={styles.childrenTitleBox}
            >
              <Text style={styles.childrenCreateText}>
                {intl.formatMessage(Messages.add)}
              </Text>
              <Icon
                name="pen"
                type="FontAwesome5"
                style={styles.childrenCreateIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={children}
          style={{
            backgroundColor: "#fff",
            margin: space.componentMargin,
            borderRadius: space.border,
          }}
          renderItem={({ item, index }) => renderItemChildren(item, index)}
          ListEmptyComponent={renderItemChildrenEmpty()}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const replaceText = () => {
    return PRIORITY_LEVEL.map((item) => ({
      text: intl.formatMessage(Messages[item.name]),
    }));
  };

  const renderActivityItem = (item) => {
    const text = highlighText(
      item.name,
      item.objects,
      styles.activityItemName,
      replaceText()
    );
    const time = getHumanDay(
      item.time,
      intl.formatMessage(Messages.datetime_format)
    );

    return (
      <View style={styles.activityItem}>
        <Text style={styles.activityItemName}>{text}</Text>
        <View style={styles.activityItemTime}>
          <Text style={styles.activityItemTimeText}>{time}</Text>
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
        title={intl.formatMessage(Messages.activity)}
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

  const renderButtonAction = () => {
    return (
      <View style={styles.contentAction}>
        <TouchableOpacity
          onPress={() => onDone()}
          style={styles.contentBtnDone(isDone)}
        >
          <Text style={styles.textDone(isDone)}>
            {intl.formatMessage(Messages.done)}
          </Text>
          {isDone ? (
            <Icon
              type="FontAwesome5"
              name="check"
              style={styles.contentDoneIcon}
            />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmDelete()}
          style={styles.contentBtnDelete}
        >
          <Text style={styles.textDelete}>
            {intl.formatMessage(Messages.delete)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal
      isVisible={visible}
      style={styles.modalWrapper}
      backdropOpacity={0.5}
      onBackdropPress={() => hide()}
      onBackButtonPress={() => hide()}
      useNativeDriver={true}
      propagateSwipe
    >
      <View style={styles.modalBody}>
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={{ paddingBottom: scale(100) }}
        >
          {renderContent()}
          {renderChildren()}
          {renderButtonAction()}
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
            <Text style={styles.activityButtonText}>
              {intl.formatMessage(Messages.activity)}
            </Text>
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
        <SelectModal
          ref={selectMemberRef}
          key={"select_member"}
          onDone={(value) => {
            if (value)
              updateTask("member", {
                assigned_member_ids: value.map((item) => item.id),
              });
          }}
          selectedData={member}
          api="member/get"
          params={{ type: "simple" }}
          multiSelect={true}
          isMember={true}
        />
        <SelectModal
          ref={selectPriorityRef}
          key={"select_priority"}
          externalData={PRIORITY_LEVEL.filter((item) => item.id != 4).map(
            (item) => {
              return { ...item, name: intl.formatMessage(Messages[item.name]) };
            }
          )}
          onDone={(value) => {
            if (value) updateTask("prior_level", { prior_level: value.id });
          }}
          selectedData={PRIORITY_LEVEL[priorityLevel]}
        />
      </View>
    </Modal>
  );
};

export default forwardRef(DetailTask);
