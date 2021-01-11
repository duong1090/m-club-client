import React, { useState, useEffect } from "react";
import Avatar from "container/component/ui/avatar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
} from "container/variables/common";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { SEX } from "container/constant/element";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { showSpinner, hideSpinner } from "container/utils/router";
import InputItem from "container/component/ui/inputItem";
import { gotoRoute } from "container/utils/router";
import { modals } from "container/constant/screen";

const UserInfo = (props) => {
  //props
  const { intl } = props;
  const { member } = global.organization || {};
  //state
  const [info, setInfo] = useState({
    name: member.name ? member.name : null,
    phone: member.phone ? member.phone : null,
    address: member.address ? member.address : null,
    sex: SEX[member.sex ? member.sex : 0],
    birthday: member.birthday ? member.birthday : null,
    department:
      member.department && member.department.name
        ? member.department.name
        : null,
    position:
      member.position && member.position.name ? member.position.name : null,
  });

  //constant
  const fields = [
    {
      name: intl.formatMessage(Messages.name),
      fieldName: "name",
      required: true,
      placeholder: intl.formatMessage(Messages.name_placeholder),
      onChangeText: (value) => onChangeField("name", value),
    },
    {
      name: intl.formatMessage(Messages.phone),
      fieldName: "phone",
      placeholder: intl.formatMessage(Messages.phone_placeholder),
      onChangeText: (value) => onChangeField("phone", value),
    },
    {
      name: intl.formatMessage(Messages.address),
      fieldName: "address",
      placeholder: intl.formatMessage(Messages.address_placeholder),
      onChangeText: (value) => onChangeField("address", value),
    },
    {
      name: intl.formatMessage(Messages.sex),
      fieldName: "sex",
      type: "button",
      placeholder: intl.formatMessage(Messages.sex_placeholder),
      onPress: () => onPressField("sex", null, null, SEX, info.sex),
    },
    {
      name: intl.formatMessage(Messages.birthday),
      fieldName: "birthday",
      type: "date_picker",
      mode: "date",
      placeholder: intl.formatMessage(Messages.birthday_placeholder),
      onChangeDate: (value) => {
        let temp = moment(value).format(
          intl.formatMessage(Messages.date_format)
        );
        onChangeField("birthday", temp);
      },
    },
    {
      name: intl.formatMessage(Messages.department),
      fieldName: "department",
      type: "button",
      placeholder: intl.formatMessage(Messages.department_placeholder),
      onPress: () =>
        onPressField("department", "department/get", {}, null, info.department),
    },
    {
      name: intl.formatMessage(Messages.position),
      fieldName: "position",
      type: "button",
      placeholder: intl.formatMessage(Messages.position_placeholder),
      onPress: () =>
        onPressField("position", "position/get", {}, null, info.department),
    },
  ];


  //function - event ------------------------------------------------------------------------------------------------------
  const onPressField = (
    fieldName,
    api,
    params = {},
    data,
    selectedItem = []
  ) => {
    let props = {
      onSelectItem: (value) => onChangeField(fieldName, value),
      selectedItem,
    };

    if (data) {
      props.data = data;
    } else if (api) {
      props.api = api;
      props.params = params;
    }

    gotoRoute(modals.SELECT_MODAL, props, true);
  };

  const onChangeField = (fieldName, value) => {
    let temp = { ...info };
    temp[fieldName] = value;
    setInfo(temp);
  };

  const prepareParams = () => {
    let params = {};
    if (member && member.id) params.id = member.id;
    if (info.name) params.name = info.name;
    if (info.phone) params.phone = info.phone;
    if (info.address) params.address = info.address;
    if (info.email) params.email = info.email;
    if (info.sex && info.sex.id) params.sex = info.sex.id;
    if (info.birthday) params.birthday = info.birthday;
    if (info.department && info.department.id)
      params.department_id = info.department.id;
    if (info.position && info.position.id)
      params.position_id = info.position.id;

    return params;
  };

  const update = () => {
    showSpinner();
    const params = prepareParams();
    postRequest(Config.API_URL.concat("member/update"), params)
      .then((res) => {
        if (res && res.data) updateSuccess();
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
        Toast.show(intl.formatMessage(Messages.update_fail), Toast.SHORT);
      });
  };

  const updateSuccess = () => {
    Toast.show(intl.formatMessage(Messages.update_success), Toast.SHORT);
  };

  //render ----------------------------------------------------------------------------------------------------------------
  const renderContentItem = (item, index) => {
    return (
      <View style={styles.itemContent}>
        <InputItem
          type={item.type ? item.type : null}
          key={index}
          style={styles.inputField}
          label={item.title}
          placeholder={item.placeholder ? item.placeholder : null}
          onPress={item.onPress ? item.onPress : null}
          onChangeText={item.onChangeText ? item.onChangeText : null}
          onChangeDate={item.onChangeDate ? item.onChangeDate : null}
          value={info && info[item.fieldName] ? info[item.fieldName] : null}
          mode={item.mode ? item.mode : null}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Avatar size={scale(150)} data={member ? member : null} />
      </View>
      <View>{fields.map((item, index) => renderContentItem(item, index))}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  itemContent: {
    marginBottom: space.componentMargin,
    paddingBottom: scale(10),
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  },
  inputField: {
    marginBottom: scale(60),
  },
});

export default injectIntl(UserInfo);
