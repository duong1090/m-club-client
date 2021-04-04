import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import BottomPopUp from "container/component/ui/bottomPopUp";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
} from "container/variables/common";
import { TextInput, View, Text, TouchableOpacity, Image } from "react-native";
import { styles, AVATAR_SIZE } from "../style/create";
import { Textarea } from "native-base";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Avatar from "container/component/ui/avatar";
import { postRequest } from "container/utils/request";
import { useRecoilState } from "recoil";
import { listTaskState } from "../recoil";
import update from "immutability-helper";
import Config from "container/config/server.config";
import { showSpinner, hideSpinner } from "container/utils/router";
import SelectModal from "container/component/ui/selectModal";

const DUE_DATE_FORMAT = "YYYY-MM-DD ";
const DUE_TIME_FORMAT = "HH:mm:ss";
const INDEX_LIST = { today: 0, future: 1, timed: 2, no_time: 3 };

const CreateTask = (props, ref) => {
  //props
  //state
  const [assignedMember, setAssignMember] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [visibleDueDate, setVisibleDueDate] = useState(false);
  const [visibleDueTime, setVisibleDueTime] = useState(false);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [listTask, setListTask] = useRecoilState(listTaskState);

  //variables
  const bottomPopUpRef = useRef(null);
  const descriptionRef = useRef(null);
  const modalSelectRef = useRef(null);
  const dueDateColor =
    dueDate ||
    (dueTime && moment(dueDate, DUE_DATE_FORMAT).isBefore(new Date()))
      ? color.colorMandy
      : color.hint;
  const intl = getIntl();

  //effect
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event
  const show = () => {
    bottomPopUpRef.current.show();
  };

  const hide = () => {
    bottomPopUpRef.current.hide();
    resetFields();
  };

  const resetFields = () => {
    setAssignMember([]);
    setDueDate(null);
    setDueTime(null);
    setName(null);
    setDescription(null);
  };

  const createTask = () => {
    showSpinner();
    const params = prepareParams();
    postRequest(Config.API_URL.concat("task/create"), params)
      .then((res) => {
        if (res && res.data) {
          props.callbackCreate && props.callbackCreate(res.data);

          //update list task
          console.log("createTask:::", listTask, INDEX_LIST[res.data.group]);
          setListTask(
            update(listTask, {
              [INDEX_LIST[res.data.group]]: { data: { $push: [res.data] } },
            })
          );
          hide();
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.log(err);
      });
  };

  const prepareParams = () => {
    console.log("prepareParams:::", dueDate, dueTime);

    let params = { prior_level: 0 };
    if (props.data && props.data.id) params.parent_id = props.data.id;
    if (name) params.name = name;
    if (dueDate) {
      if (dueTime) params.end_date = `${dueDate} ${dueTime}`;
      else params.end_date = dueDate;
    }
    if (assignedMember.length)
      params.assigned_mem_ids = assignedMember.map((item) => item.id);
    if (description) params.description = description;
    return params;
  };

  const openEmployeePicker = () => {
    modalSelectRef && modalSelectRef.current.show();
  };

  const openDatePicker = () => {
    setVisibleDueDate(true);
  };

  const openTimePicker = () => {
    setVisibleDueTime(true);
  };

  //render
  const renderDueTime = () => {
    return (
      <TouchableOpacity
        onPress={() => openTimePicker()}
        style={styles.dueDateWrap}
      >
        <Image
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          source={require("container/asset/icon/dukien.png")}
        />
        <View style={{ marginLeft: scale(15) }}>
          <Text style={{ ...defaultText, fontSize: fontSize.size26 }}>
            {intl.formatMessage(Messages.due_time)}
          </Text>
          {dueTime ? (
            <Text
              style={{
                ...defaultText,
                fontSize: fontSize.size26,
                fontWeight: "bold",
                color: dueDateColor,
              }}
            >
              {moment(dueTime, DUE_TIME_FORMAT).format(
                intl.formatMessage(Messages.due_time_format)
              )}
            </Text>
          ) : null}
        </View>
        <DateTimePickerModal
          mode="time"
          isVisible={visibleDueTime}
          onConfirm={(date) => {
            setVisibleDueTime(false);
            setDueTime(
              moment(date).format(intl.formatMessage(Messages.due_time_format))
            );
          }}
          onCancel={() => setVisibleDueTime(false)}
        />
      </TouchableOpacity>
    );
  };

  const renderDueDate = () => {
    return (
      <TouchableOpacity
        require
        onPress={() => openDatePicker()}
        style={styles.dueDateWrap}
      >
        <Image
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          source={require("container/asset/icon/unassign-hanchot.png")}
        />
        <View style={{ marginLeft: scale(15) }}>
          <Text style={{ ...defaultText, fontSize: fontSize.size26 }}>
            {intl.formatMessage(Messages.due_date)}
          </Text>
          {dueDate ? (
            <Text
              font-size-22
              bold
              style={{
                ...defaultText,
                fontSize: fontSize.size26,
                color: dueDateColor,
              }}
            >
              {moment(dueDate, DUE_DATE_FORMAT).format(
                intl.formatMessage(Messages.due_date_format)
              )}
            </Text>
          ) : null}
        </View>
        <DateTimePickerModal
          mode="date"
          isVisible={visibleDueDate}
          onConfirm={(date) => {
            setVisibleDueDate(false);
            setDueDate(moment(date).format(DUE_DATE_FORMAT));
          }}
          onCancel={() => setVisibleDueDate(false)}
        />
      </TouchableOpacity>
    );
  };

  const renderAvatar = () => {
    const limit = 3;

    if (assignedMember.length == 1) {
      return (
        <View style={styles.avatarBox}>
          <Avatar size={AVATAR_SIZE} data={assignedMember[0]} />
          <Text numberOfLines={2} style={styles.assignedName}>
            {assignedMember[0].name}
          </Text>
        </View>
      );
    } else if (assignedMember.length > limit)
      return (
        <View style={styles.avatarBox}>
          {[...Array(limit + 1).keys()].map((item, index) => {
            if (index >= limit)
              return (
                <View
                  style={[
                    styles.moreAvatar,
                    styles.avatar,
                    { left: limit * (AVATAR_SIZE / 2) },
                  ]}
                >
                  <Text style={styles.textMoreAvatar}>
                    {`+${assignedMember.length - limit}`}
                  </Text>
                </View>
              );
            else
              return (
                <Avatar
                  style={[styles.avatar, { left: index * (AVATAR_SIZE / 2) }]}
                  size={AVATAR_SIZE}
                  data={assignedMember[index]}
                />
              );
          })}
        </View>
      );
    else
      return (
        <View style={styles.avatarBox}>
          {assignedMember.map((item, index) => (
            <Avatar
              style={[styles.avatar, { left: index * (AVATAR_SIZE / 2) }]}
              size={AVATAR_SIZE}
              data={item}
            />
          ))}
        </View>
      );
  };

  const renderAssignedMember = () => {
    return (
      <TouchableOpacity
        style={styles.assignWrap}
        onPress={() => openEmployeePicker()}
      >
        {assignedMember.length ? (
          renderAvatar()
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: AVATAR_SIZE,
                paddingVertical: space.bgPadding,
              }}
            >
              <Image
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                source={require("container/asset/icon/unassign-nhanvien.png")}
              />
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
            </View>
          </View>
        )}
        <SelectModal
          key={"assigned_member"}
          type="list"
          ref={modalSelectRef}
          onDone={(value) => setAssignMember(value)}
          api="member/get"
          params={{ type: "simple" }}
          multiSelect={true}
          selectedData={assignedMember}
          isMember={true}
        />
      </TouchableOpacity>
    );
  };

  const renderName = () => {
    return (
      <TextInput
        onChangeText={(text) => setName(text)}
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
    );
  };

  const renderDescription = () => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Textarea
          ref={descriptionRef}
          autoCorrect={false}
          onChangeText={(text) => setDescription(text)}
          rowSpan={3}
          placeholder={intl.formatMessage(Messages.description)}
          placeholderTextColor={color.text}
          style={{
            flex: 1,
            marginTop: scale(15),
            paddingLeft: 0,
          }}
        />
      </View>
    );
  };

  return (
    <BottomPopUp
      ref={bottomPopUpRef}
      body={
        <View style={{ height: scale(500), marginBottom: scale(30) }}>
          {renderName()}
          <View style={styles.blockItem}>
            {renderAssignedMember()}
            {renderDueDate()}
            {dueDate ? renderDueTime() : null}
          </View>
          {renderDescription()}
        </View>
      }
      toolbar={() => (
        <TouchableOpacity
          onPress={() => createTask()}
          style={styles.createButton}
        >
          <Text style={styles.textCreateButton}>
            {intl.formatMessage(Messages.create)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default forwardRef(CreateTask);
