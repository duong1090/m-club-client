import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import BottomPopUp from "container/component/ui/bottomPopUp";
import styles from "../style/create";
import InputItem from "container/component/ui/inputItem";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import { TextInput, View, TouchableOpacity, Text, Image } from "react-native";
import { scale, color, fontSize, space } from "container/variables/common";
import { Textarea } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import ModalContext from "container/context/modal";
import { postRequest } from "container/utils/request";
import Toast from "react-native-simple-toast";

const DEFAULT_VALUE = {
  department: null,
  position: null,
  member: null,
  title: null,
  description: null,
};

const DUE_DATE_FORMAT = "YYYY-MM-DD ";
const DUE_TIME_FORMAT = "HH:mm:ss";
const ICON_SIZE = scale(60);
const intl = getIntl();

const CreateNotification = (props, ref) => {
  //state
  const [formValue, setFormValue] = useState(DEFAULT_VALUE);
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [visibleDueDate, setVisibleDueDate] = useState(false);
  const [visibleDueTime, setVisibleDueTime] = useState(false);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //variables
  const dueDateColor =
    dueDate ||
    (dueTime && moment(dueDate, DUE_DATE_FORMAT).isBefore(new Date()))
      ? color.colorMandy
      : color.hint;

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //ref
  const bottomPopUpRef = useRef(null);

  //function --------------------------------------------------------------------------------------

  const show = () => {
    bottomPopUpRef.current.show();
  };

  const hide = () => {
    bottomPopUpRef.current.hide();
    resetFields();
  };

  const resetFields = () => {
    setFormValue(DEFAULT_VALUE);
    setDueDate(null);
    setDueTime(null);
  };

  const onChangeField = (fieldName, value) => {
    let temp = { ...formValue };
    temp[fieldName] = value;
    setFormValue(temp);
  };

  const prepareParams = () => {
    const { department, position, member, title, description } = formValue;
    let params = {};

    console.log("prepareParams:::", formValue);

    if (department && department.length)
      params.department_ids = department.map((item) => item.id);
    if (position && position.length)
      params.position_ids = position.map((item) => item.id);
    if (member && member.length)
      params.member_ids = member.map((item) => item.id);
    if (title) params.title = title;
    if (description) params.content = description;
    if (dueDate) {
      if (dueTime) params.time_schedule = `${dueDate} ${dueTime}`;
      else params.time_schedule = dueDate;
      params.is_schedule = 1;
    }

    return params;
  };

  const create = () => {
    showSpinner();
    let params = prepareParams();

    postRequest("notification/push", params)
      .then((res) => {
        if (res && res.data) {
          //success
          console.log("create:::notification:::", res.data);
          Toast.show(intl.formatMessage(Messages.create_success), Toast.LONG);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  //render ----------------------------------------------------------------------------------------

  const INPUT = [
    {
      fieldName: "department",
      type: "button",
      placeholder: intl.formatMessage(Messages.department_placeholder),
      modalObj: {
        api: "department/get",
        params: {},
        onDone: (value) => {
          console.log("doneroine::::", value);
          onChangeField("department", value);
        },
        multiSelect: true,
      },
      key: "department",
    },
    {
      fieldName: "position",
      type: "button",
      placeholder: intl.formatMessage(Messages.position_placeholder),
      modalObj: {
        api: "position/get",
        params: {},
        onDone: (value) => onChangeField("position", value),
        multiSelect: true,
      },
      key: "position",
    },
    {
      fieldName: "member",
      type: "button",
      placeholder: intl.formatMessage(Messages.select_title, {
        title: intl.formatMessage(Messages.member).toLowerCase(),
      }),
      modalObj: {
        api: "member/get",
        params: { type: "simple" },
        onDone: (value) => onChangeField("member", value),
        isMember: true,
        multiSelect: true,
      },
      key: "member",
    },
  ];

  const renderDeadline = () => {
    return (
      <View style={styles.deadlineBox}>
        {renderDueDate()}
        {dueDate ? renderDueTime() : null}
      </View>
    );
  };

  const renderDueTime = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisibleDueTime(true)}
        style={styles.dueDateWrap}
      >
        <Image
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          source={require("container/asset/icon/dukien.png")}
        />
        <View style={{ marginLeft: scale(15) }}>
          <Text style={{ fontSize: fontSize.size26 }}>
            {intl.formatMessage(Messages.due_time)}
          </Text>
          {dueTime ? (
            <Text
              style={{
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
            setDueTime(moment(date).format(DUE_TIME_FORMAT));
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
        onPress={() => setVisibleDueDate(true)}
        style={styles.dueDateWrap}
      >
        <Image
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          source={require("container/asset/icon/unassign-hanchot.png")}
        />
        <View style={{ marginLeft: scale(15) }}>
          <Text style={{ fontSize: fontSize.size26 }}>
            {intl.formatMessage(Messages.due_date)}
          </Text>
          {dueDate ? (
            <Text
              font-size-22
              bold
              style={{
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

  const renderPicker = () => {
    return (
      <View style={styles.pickerBox}>
        {INPUT.map((item, index) => (
          <InputItem
            type={item.type ? item.type : null}
            key={index}
            style={styles.inputField}
            required={item.required ? item.required : false}
            placeholder={item.placeholder ? item.placeholder : null}
            onPress={item.onPress ? item.onPress : null}
            value={formValue[item.fieldName]}
            modalObj={item.modalObj}
          />
        ))}
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <TextInput
        onChangeText={(text) => onChangeField("title", text)}
        autoFocus
        autoCorrect={false}
        maxLength={200}
        placeholder={intl.formatMessage(Messages.title)}
        style={{
          fontSize: fontSize.size32,
          marginBottom: space.itemMargin,
        }}
        blurOnSubmit={false}
        returnKeyType="next"
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
          autoCorrect={false}
          onChangeText={(text) => onChangeField("description", text)}
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
      reset={resetFields}
      title={intl.formatMessage(Messages.create_title, {
        title: intl.formatMessage(Messages.tab_notification).toLowerCase(),
      })}
      body={
        <View style={styles.bodyBox}>
          {renderPicker()}
          {renderTitle()}
          {renderDeadline()}
          {renderDescription()}
        </View>
      }
      toolbar={() => (
        <TouchableOpacity onPress={() => create()} style={styles.createButton}>
          <Text style={styles.textCreateButton}>
            {intl.formatMessage(Messages.create)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default forwardRef(CreateNotification);
