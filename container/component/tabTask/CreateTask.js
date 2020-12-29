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
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Textarea } from "native-base";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Avatar from "container/component/ui/avatar";
import { gotoRoute } from "container/utils/router";
import { modals } from "container/constant/screen";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { showSpinner, hideSpinner } from "container/utils/router";

const intl = getIntl();
const AVATAR_SIZE = scale(60);
const DUE_DATE_FORMAT = "YYYY-MM-DD ";
const DUE_TIME_FORMAT = "HH:mm:ss";

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

  //variables
  const bottomPopUpRef = useRef(null);
  const descriptionRef = useRef(null);
  const dueDateColor =
    dueDate ||
    (dueTime && moment(dueDate, DUE_DATE_FORMAT).isBefore(new Date()))
      ? color.colorMandy
      : color.hint;

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
  };

  const createTask = () => {
    showSpinner();
    const params = prepareParams();
    postRequest(Config.API_URL.concat("task/create"), params)
      .then((res) => {
        if (res && res.data) {
          props.callbackCreate && props.callbackCreate(res.data);
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
    let params = { prior_level: 0 };
    if (props.data && props.data.id) params.parent_id = props.data.id;
    if (name) params.name = name;
    if (dueDate) {
      if (dueTime) params.end_date = `${dueDate} ${dueTime}`;
      else params.end_date = dueDate;
    }
    if (assignedMember.length)
      params.assigned_user_ids = assignedMember.map((item) => item.id);
    if (description) params.description = description;
    return params;
  };

  const openEmployeePicker = () => {
    let passProps = {
      onSelectItem: (value) => {
        console.log("onSelectItem:::", value, assignedMember);
        setAssignMember(assignedMember.concat(value));
      },
      api: "member/get",
      params: { type: "simple" },
      multiSelect: true,
      isMember: true,
    };
    gotoRoute(modals.SELECT_MODAL, passProps, true);
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
            setDueDate(
              moment(date).format(intl.formatMessage(Messages.date_format))
            );
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
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
      isUseKeyBoard
      height={scale(400)}
      animateToY={scale(-700)}
      limitAnimateY={scale(-800)}
      body={
        <View style={{ width: "100%" }}>
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

const styles = StyleSheet.create({
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
    height: "100%",
    width: "28%",
  },
  dueDateWrap: {
    marginLeft: scale(50),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  avatarBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  avatar: {
    position: "absolute",
    top: -AVATAR_SIZE / 2,
  },
  moreAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    ...shadow,
  },
  textMoreAvatar: {
    ...defaultText,
    fontWeight: "bold",
    color: "#fff",
  },
  assignedName: {
    ...defaultText,
    maxWidth: "75%",
    fontWeight: "bold",
    marginLeft: space.itemMargin,
  },
});

export default forwardRef(CreateTask);
