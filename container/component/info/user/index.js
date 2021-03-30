import React, { useState, useEffect } from "react";
import Avatar from "container/component/ui/avatar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  scale,
  color,
  space,
  shadow,
  defaultText,
  fontSize,
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
import { Icon } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Navigation } from "react-native-navigation";
import RNFetchBlob from "rn-fetch-blob";

const UserInfo = (props) => {
  //props
  const { intl, updateCallback, componentId } = props;
  const { member } = global.organization || {};
  //state
  const [info, setInfo] = useState({
    name: member.name ? member.name : null,
    phone: member.phone ? member.phone : null,
    address: member.address ? member.address : null,
    sex: SEX[member.sex ? member.sex : 0],
    birthday: member.birthday ? member.birthday : null,
    department: member.department ? member.department : null,
    position: member.position ? member.position : null,
  });
  const [avatar, setAvatar] = useState(member ? member : {});
  const { showActionSheetWithOptions } = useActionSheet();

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.user_info),
      },
    },
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
      modalObj: {
        key: "sex",
        externalData: SEX,
        selectedData: info.sex,
        onDone: (value) => onChangeField("sex", value),
        // multiSelect: true,
      },
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
      modalObj: {
        key: "department",
        api: "department/get",
        params: {},
        selectedData: info.department,
        onDone: (value) => onChangeField("department", value),
      },
    },
    {
      name: intl.formatMessage(Messages.position),
      fieldName: "position",
      type: "button",
      placeholder: intl.formatMessage(Messages.position_placeholder),
      modalObj: {
        key: "position",
        api: "position/get",
        params: {},
        selectedData: info.position,
        onDone: (value) => onChangeField("position", value),
      },
    },
  ];

  //function - event ------------------------------------------------------------------------------------------------------
  const optionGetImage = () => {
    const options = [
      intl.formatMessage(Messages.take_photo),
      intl.formatMessage(Messages.select_photo_from_library),
      intl.formatMessage(Messages.cancel),
    ];
    showActionSheetWithOptions(
      { options, cancelButtonIndex: 2 },
      (buttonIndex) => {
        if (buttonIndex == 0) takePhoto();
        else if (buttonIndex == 1) selectPhoto();
      }
    );
  };

  const takePhoto = () => {
    const options = {
      mediaType: "photo",
      maxWidth: scale(500),
      maxHeight: scale(500),
      quality: 1,
      includeBase64: true,
    };
    launchCamera(options, (image) => {
      if (image && image.base64) updateAvatar(image);
    });
  };

  const selectPhoto = () => {
    const options = {
      mediaType: "photo",
      maxWidth: scale(500),
      maxHeight: scale(500),
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, (image) => {
      if (image && image.base64) updateAvatar(image);
    });
  };

  const updateAvatar = (image) => {
    showSpinner();

    const params = new FormData();
    params.append("image", image.base64);

    postRequest(Config.API_URL.concat("member/update-avatar"), params)
      .then((res) => {
        if (res && res.data) {
          console.log("updateAvatar:::", res.data);
          setAvatar(JSON.parse(JSON.stringify(member)));
          updateCallback && updateCallback();
          Toast.show(intl.formatMessage(Messages.update_success), Toast.SHORT);
        }
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
        Toast.show(intl.formatMessage(Messages.update_fail), Toast.SHORT);
      });
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
          label={item.name}
          placeholder={item.placeholder ? item.placeholder : null}
          onPress={item.onPress ? item.onPress : null}
          onChangeText={item.onChangeText ? item.onChangeText : null}
          onChangeDate={item.onChangeDate ? item.onChangeDate : null}
          value={info && info[item.fieldName] ? info[item.fieldName] : null}
          mode={item.mode ? item.mode : null}
          modalObj={item.modalObj ? item.modalObj : null}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: space.bgPadding * 2 }}
    >
      <View style={styles.avatarBox}>
        <Avatar size={scale(300)} data={avatar} />
        <TouchableOpacity
          style={styles.cameraBox}
          onPress={() => optionGetImage()}
        >
          <Icon name="camera" style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
      <View>{fields.map((item, index) => renderContentItem(item, index))}</View>
      <TouchableOpacity style={styles.doneBox} onPress={() => update()}>
        <Text style={styles.titleSymbol}>
          {intl.formatMessage(Messages.done)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
  },
  avatarBox: {
    padding: scale(60),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.backgroundColor,
    marginBottom: space.componentMargin * 2,
    borderRadius: space.border,
  },
  itemContent: {
    marginBottom: space.componentMargin,
    paddingBottom: scale(10),
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  },
  inputField: {
    marginBottom: space.componentMargin,
  },
  cameraBox: {
    position: "absolute",
    bottom: space.bgPadding,
    right: space.bgPadding,
  },
  cameraIcon: {
    color: color.info,
    fontSize: scale(60),
  },
  doneBox: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    backgroundColor: color.warning,
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    ...shadow,
  },
  titleSymbol: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
});

export default injectIntl(UserInfo);
