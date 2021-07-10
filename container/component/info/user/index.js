import React, { useState, useEffect, useContext } from "react";
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
  fontSize,
} from "container/variables/common";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { SEX } from "container/constant/element";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { postRequest } from "container/utils/request";
import ModalContext from "container/context/modal";
import InputItem from "container/component/ui/inputItem";
import { Icon } from "native-base";
import ImagePicker from "react-native-image-crop-picker";

import { Navigation } from "react-native-navigation";
import ModalPopUp from "container/component/ui/modalPopUp";
import QRCode from "react-native-qrcode-svg";
import { QR_MEMBER } from "../../../constant/qrdecode";

const UserInfo = (props) => {
  //props
  const { intl, updateCallback, componentId, member } = props;
  // const { member } = global.organization || {};
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
  const [qrVisible, setQRVisible] = useState(false);

  //context
  const { showSpinner, hideSpinner, showActionSheet } = useContext(
    ModalContext
  );

  //event button navigation
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      if (buttonId == "qr_code") setQRVisible(true);
    }
  );

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.user_info),
      },
      rightButtons: [
        {
          id: "qr_code",
          icon: require("container/asset/icon/qr_code.png"),
        },
      ],
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
    const actions = [
      {
        title: intl.formatMessage(Messages.take_photo),
        onPress: () => takePhoto(),
      },
      {
        title: intl.formatMessage(Messages.select_photo_from_library),
        onPress: () => selectPhoto(),
      },
      {
        title: intl.formatMessage(Messages.cancel),
        type: "danger",
      },
    ];

    showActionSheet({ actions });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      useFrontCamera: true,
      includeBase64: true,
      compressImageQuality: 1,
      compressImageMaxHeight: scale(500),
      compressImageMaxWidth: scale(500),
    }).then((image) => {
      if (image) updateAvatar(image);
    });
  };

  const selectPhoto = () => {
    console.log("selectPhoto:::");
    ImagePicker.openPicker({
      includeBase64: true,
    })
      .then((image) => {
        if (image) updateAvatar(image);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateAvatar = (image) => {
    showSpinner();

    const params = new FormData();
    params.append("image", image.data);

    postRequest("member/update-avatar", params)
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
    postRequest("member/update", params)
      .then((res) => {
        if (res && res.data) updateSuccess(res.data);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
        Toast.show(intl.formatMessage(Messages.update_fail), Toast.SHORT);
      });
  };

  const updateSuccess = (data) => {
    Toast.show(intl.formatMessage(Messages.update_success), Toast.SHORT);
    updateCallback && updateCallback(data);
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
        <View style={styles.avatar}>
          <Avatar size={scale(300)} data={avatar} />
        </View>
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
      <ModalPopUp
        title={intl.formatMessage(Messages.your_qr_code)}
        isVisible={qrVisible}
        onClose={() => setQRVisible(false)}
        coverScreen={true}
      >
        <View style={styles.qrBox}>
          <QRCode value={`${QR_MEMBER},${member.id}`} size={scale(400)} />
        </View>
      </ModalPopUp>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
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
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    backgroundColor: color.success,
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
  },
  titleSymbol: {
    color: "#fff",
  },
  qrBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: space.componentMargin * 2,
  },
});

export default injectIntl(UserInfo);
