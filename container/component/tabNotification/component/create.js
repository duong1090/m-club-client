import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import BottomPopUp from "container/component/ui/bottomPopUp";
import styles from "../style/create";
import InputItem from "container/component/ui/inputItem";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import { gotoRoute } from "container/utils/router";
import { modals } from "container/constant/screen";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { scale, color, fontSize } from "container/variables/common";
import { Textarea } from "native-base";

const DEFAULT_VALUE = {
  department: null,
  position: null,
  member: null,
  title: null,
  description: null,
};

const CreateNotification = (props, ref) => {
  //state
  const [formValue, setFormValue] = useState(DEFAULT_VALUE);

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
  };

  const onPressField = (fieldName, api, selectedItem = []) => {
    let props = {
      onSelectItem: (value) => onChangeField(fieldName, value),
      selectedItem,
      api,
      isMember: fieldName == "member" ? true : false,
      params: { type: "simple" },
    };

    gotoRoute(modals.SELECT_MODAL, props, true);
  };

  const onChangeField = (fieldName, value) => {
    let temp = { ...formValue };
    temp[fieldName] = value;
    setFormValue(temp);
  };

  //render ----------------------------------------------------------------------------------------

  const INPUT = [
    {
      fieldName: "department",
      type: "button",
      placeholder: getIntl().formatMessage(Messages.department_placeholder),
      modalObj: {
        api: "department/get",
        params: {},
        onDone: (value) => onChangeField("department", value),
      },
      key: "department",
    },
    {
      fieldName: "position",
      type: "button",
      placeholder: getIntl().formatMessage(Messages.position_placeholder),
      modalObj: {
        api: "position/get",
        params: {},
        onDone: (value) => onChangeField("position", value),
      },
      key: "position",
    },
    {
      fieldName: "member",
      type: "button",
      placeholder: getIntl().formatMessage(Messages.select_title, {
        title: getIntl().formatMessage(Messages.member).toLowerCase(),
      }),
      modalObj: {
        api: "member/get",
        params: { type: "simple" },
        onDone: (value) => onChangeField("member", value),
        isMember: true,
      },
      key: "member",
    },
  ];

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
            value={
              formValue && formValue[item.fieldName]
                ? formValue[item.fieldName]
                : null
            }
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
        placeholder={getIntl().formatMessage(Messages.title)}
        style={{
          fontSize: fontSize.size32,
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
      title={getIntl().formatMessage(Messages.create_title, {
        title: getIntl().formatMessage(Messages.tab_notification).toLowerCase(),
      })}
      body={
        <View style={styles.bodyBox}>
          {renderPicker()}
          {renderTitle()}
          {renderDescription()}
        </View>
      }
      toolbar={() => (
        <TouchableOpacity onPress={() => {}} style={styles.createButton}>
          <Text style={styles.textCreateButton}>
            {intl.formatMessage(Messages.create)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default forwardRef(CreateNotification);
