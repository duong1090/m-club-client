import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { currEventState, listEventState } from "../recoil";
import { useRecoilState } from "recoil";
import SliderImage from "container/component/ui/sliderImage";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import {
  color,
  scale,
  space,
  fontSize,
  shadow,
} from "container/variables/common";
import { getIntl } from "container/utils/common";
import {
  formatDateTime,
  formatHumanDate,
  formatPlace,
  formatInterested,
  interestEvent,
  goingToEvent,
} from "../utils";
import Avatar from "container/component/ui/avatar";
import ImagePicker from "react-native-image-crop-picker";
import Messages from "container/translation/Message";
import { Icon } from "native-base";
import Modal from "react-native-modal";
import update from "immutability-helper";
import { gotoRoute } from "../../../../utils/router";
import { screens } from "container/constant/screen";
import ModalContext from "container/context/modal";
import { Navigation } from "react-native-navigation";
import { elevation } from "../../../../constant/screen";
import Attendance from "./attendance";
import { QR_EVENT } from "../../../../constant/qrdecode";
import QRCode from "react-native-qrcode-svg";

const Detail = (props, ref) => {
  //props
  //state
  const [visible, setVisible] = useState(false);
  const [currMode, setCurrMode] = useState("view");
  const [data, setData] = useRecoilState(currEventState);
  const [list, setList] = useRecoilState(listEventState);

  //variables
  const intl = getIntl();
  const { member: currMember } = global.organization || {};
  const inputRef = {
    name: useRef(null),
    place: useRef(null),
    time: useRef(null),
    price: useRef(null),
    content: useRef(null),
  };
  const attendanceRef = useRef(null);
  const modalContext = useContext(ModalContext);

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //functions -------------------------------------------------------------------------
  const show = () => {
    setVisible(true);
    Navigation.mergeOptions(screens.EVENT, {
      topBar: {
        visible: false,
      },
    });
  };

  const hide = () => {
    setVisible(false);
    Navigation.mergeOptions(screens.EVENT, {
      topBar: {
        visible: true,
      },
    });
  };

  const gotoAttendancePage = () => {
    attendanceRef.current && attendanceRef.current.show();
  };

  const onChangeData = (fieldName, value) => {
    if (fieldName && value != null) {
      setData(update(data, { [fieldName]: { $set: value } }));
    }
  };

  const focusInput = (fieldName) => {
    if (fieldName && inputRef[fieldName]) inputRef[fieldName].current.focus();
  };

  const onBlurInput = (fieldName) => {
    if (fieldName) updateEvent(fieldName);
  };

  const updateEvent = (fieldName) => {
    const params = {
      id: data.id ? data.id : null,
      [fieldName]: data[fieldName],
    };
    postRequest("event/update", params).then((res) => {
      if (res && res.data) callBackUpdate(res.data);
    });
  };

  const callBackUpdate = (resData) => {
    setData({ ...resData, index: data.index });
    setList(update(list, { [data.index]: { $set: resData } }));
  };

  const addImage = (images) => {
    const params = new FormData();
    if (data.id) params.append("id", data.id);
    if (images && images.length)
      images.map((img, index) => {
        params.append(`images[${index}]`, img.data);
      });

    postRequest("event/add-image", params).then((res) => {
      if (res && res.data) callBackUpdate(res.data);
    });
  };

  const deleteImage = (imgPath) => {
    if (imgPath) {
      const params = {
        image_path: imgPath,
        id: data.id ? data.id : null,
      };
      postRequest("event/delete-image", params).then((res) => {
        if (res && res.data) callBackUpdate(res.data);
      });
    }
  };

  const onDeleteEvent = () => {};

  const openPhotoLibrary = () => {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then((images) => {
      if (images && images.length) addImage(images);
    });
  };

  const gotoCreateTask = () => {
    gotoRoute(screens.TAB_TASK, {
      mode: "create",
      passData: { id: data.id, type: "event", name: data.name },
    });
  };

  const openOptionSetting = () => {
    const actions = [
      {
        title: intl.formatMessage(Messages.create_title, {
          title: intl.formatMessage(Messages.tab_task).toLowerCase(),
        }),
        onPress: () => gotoCreateTask(),
      },
      {
        title: intl.formatMessage(Messages.attendance),
        onPress: () => gotoAttendancePage(),
      },
      {
        title: intl.formatMessage(Messages.delete),
        onPress: () => onDeleteEvent(),
        type: "danger",
      },
    ];

    modalContext.showActionSheet({ actions });
  };

  //render ----------------------------------------------------------------------------
  const renderControl = () => {
    return (
      <View style={styles.controlBox}>
        <TouchableOpacity onPress={() => hide()} style={styles.backButton}>
          <Icon
            name="chevron-left"
            type="FontAwesome5"
            style={styles.controlIcon}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {currMode == "edit" ? (
            <TouchableOpacity
              onPress={() => openPhotoLibrary()}
              style={styles.backButton}
            >
              <Icon
                name="plus"
                type="Entypo"
                style={[
                  styles.controlIcon,
                  { fontSize: scale(45), paddingLeft: scale(5) },
                ]}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderImage = () => {
    const images = data.image_paths
      ? data.image_paths.map((item) => Config().API_IMAGE(`event/${item}.jpg`))
      : null;

    return (
      <SliderImage
        images={images}
        isDelete={currMode == "edit"}
        onDelete={(index) =>
          deleteImage(data.image_paths && data.image_paths[index])
        }
      />
    );
  };

  const renderPenEdit = (fieldName) => {
    return currMode == "edit" ? (
      <TouchableOpacity onPress={() => focusInput(fieldName)}>
        <Icon type="FontAwesome5" name="pen" style={styles.penEditIcon} />
      </TouchableOpacity>
    ) : (
      <View style={styles.penEditBox} />
    );
  };

  const renderBasicInfo = () => {
    const timeValue = formatHumanDate(
      data.status,
      data.start_date,
      data.end_date
    );
    const nameValue = data.name;
    const placeValue = formatPlace(data.is_online, data.place);

    return (
      <View style={styles.basicBox}>
        <Text style={styles.timeText} numberOfLines={1}>
          {timeValue}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: space.itemMargin,
          }}
        >
          <TextInput
            multiline
            style={styles.titleText}
            ref={inputRef.name}
            value={nameValue}
            editable={currMode == "edit"}
            onChangeText={(text) => onChangeData("name", text)}
            onBlur={() => onBlurInput("name")}
          />
          {renderPenEdit("name")}
        </View>
        <Text style={styles.placeText} numberOfLines={2}>
          {placeValue}
        </Text>
        {renderAction()}
        {renderDetailInfo()}
      </View>
    );
  };

  const renderAction = () => {
    const ACTIONS = [
      {
        title: intl.formatMessage(Messages.interested),
        icon: { name: "star", type: "FontAwesome" },
        onPress: (isActive) =>
          interestEvent(data.id ? data.id : null, isActive, callBackUpdate),
        disabled: currMode == "edit",
        key: "interested_menbers",
      },
      {
        title: intl.formatMessage(Messages.going),
        icon: { name: "checkcircle", type: "AntDesign" },
        onPress: (isActive) =>
          goingToEvent(data.id ? data.id : null, isActive, callBackUpdate),
        disabled: currMode == "edit",
        key: "participant_members",
      },
      {
        title:
          currMode == "edit"
            ? intl.formatMessage(Messages.view)
            : intl.formatMessage(Messages.edit),
        icon:
          currMode == "edit"
            ? { name: "eye", type: "Ionicons" }
            : { name: "pen", type: "FontAwesome5" },
        onPress: () => setCurrMode(currMode == "edit" ? "view" : "edit"),
        disabled: false,
      },
      {
        title: intl.formatMessage(Messages.more),
        icon: { name: "dots-three-horizontal", type: "Entypo" },
        onPress: () => openOptionSetting(),
        disabled: false,
      },
    ];

    return (
      <View style={styles.actionBox}>
        {ACTIONS.map((item) => {
          const isActive =
            item.key &&
            data[item.key] &&
            data[item.key].findIndex((i) => i.id == currMember.id) >= 0
              ? true
              : false;

          const colorIcon = item.disabled
            ? color.disable
            : isActive
            ? color.background
            : color.text;

          return (
            <TouchableOpacity
              disabled={item.disabled}
              onPress={() => item.onPress(isActive)}
              style={{ alignItems: "center", flex: 1 }}
            >
              <View style={styles.actionIconBox}>
                <Icon
                  name={item.icon.name}
                  type={item.icon.type}
                  style={styles.actionIcon(colorIcon)}
                />
              </View>
              <Text style={styles.actionText(item.disabled)}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDetailInfo = () => {
    const INFO = [
      {
        title: formatInterested(
          data.interested_menbers,
          data.participant_members
        ),
        icon: {
          name: "people",
          type: "Ionicons",
        },
        editable: false,
      },
      {
        title: formatPlace(data.is_online, data.place),
        icon: data.is_online
          ? { name: "globe", type: "FontAwesome" }
          : { name: "place", type: "MaterialIcons" },
        editable: data.is_online ? false : true,
        fieldName: "place",
      },
      {
        title: formatDateTime(data.start_date, data.end_date),
        icon: {
          name: "time",
          type: "Ionicons",
        },
        bold: true,
        editable: false,
      },
      {
        title:
          (data.price && data.price.toString()) ||
          intl.formatMessage(Messages.free),
        icon: {
          name: "pricetag",
          type: "Ionicons",
        },
        editable: true,
        fieldName: "price",
      },
    ];
    return (
      <View style={{ marginTop: space.componentMargin }}>
        {INFO.map((item) => (
          <View style={styles.infoBox}>
            <View style={styles.iconInfoBox}>
              <Icon
                name={item.icon.name}
                type={item.icon.type}
                style={styles.iconInfo}
              />
            </View>
            <TextInput
              multiline
              editable={item.editable}
              style={[styles.textInfo, item.bold ? { fontWeight: "bold" } : {}]}
              value={item.title}
              onChangeText={(text) => onChangeData(item.fieldName, text)}
              ref={inputRef[item.fieldName]}
              onBlur={() => onBlurInput(item.fieldName)}
            />
            {item.editable ? renderPenEdit(item.fieldName) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.contentBox}>
        <Text style={styles.titleContent}>
          {intl.formatMessage(Messages.content)}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            multiline
            style={[styles.textContent, { padding: 0, flex: 1 }]}
            value={data.content}
            onChangeText={(text) => onChangeData("content", text)}
            onBlur={() => onBlurInput("content")}
            ref={inputRef.content}
          />
          {renderPenEdit("content")}
        </View>
      </View>
    );
  };

  const renderMember = (member, size = scale(100)) => {
    return (
      <View style={styles.memberBox}>
        <Avatar data={member} size={size} noShadow />
        <Text style={[styles.textInfo, { marginLeft: space.componentMargin }]}>
          {member ? member.name : ""}
        </Text>
      </View>
    );
  };

  const renderHost = () => {
    return (
      <View style={styles.contentBox}>
        <Text style={styles.titleContent}>
          {intl.formatMessage(Messages.hosted_by)}
        </Text>
        {renderMember(currMember)}
      </View>
    );
  };

  const renderInterestedList = () => {
    const fakeData = [currMember, currMember, currMember];

    return (
      <FlatList
        contentContainerStyle={styles.contentBox}
        data={data.interested_menbers}
        keyExtractor={(item, index) => `interested_${index}`}
        renderItem={({ item }) => renderMember(item, scale(80))}
        ListHeaderComponent={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.titleContent}>
              {intl.formatMessage(Messages.interested)}
            </Text>
            <Text
              style={[
                styles.titleContent,
                { marginLeft: space.itemMargin, fontWeight: "normal" },
              ]}
            >
              ●{"  "}
              {data.interested_menbers ? data.interested_menbers.length : null}
            </Text>
          </View>
        }
      />
    );
  };

  const renderGoingList = () => {
    // const fakeData = [currMember, currMember, currMember];

    return (
      <FlatList
        contentContainerStyle={styles.contentBox}
        data={data.participant_members}
        keyExtractor={(item, index) => `going_${index}`}
        renderItem={({ item }) => renderMember(item)}
        ListHeaderComponent={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.titleContent}>
              {intl.formatMessage(Messages.going)}
            </Text>
            <Text
              style={[
                styles.titleContent,
                { marginLeft: space.itemMargin, fontWeight: "normal" },
              ]}
            >
              ●{"  "}
              {data.participant_members
                ? data.participant_members.length
                : null}
            </Text>
          </View>
        }
      />
    );
  };

  const renderQRCode = () => {
    return (
      <View style={styles.contentBox}>
        <Text style={styles.titleContent}>
          {intl.formatMessage(Messages.event_qr_code)}
        </Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <QRCode value={`${QR_EVENT},${data.id}`} size={scale(400)} />
        </View>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <React.Fragment>
        <Attendance ref={attendanceRef} />
      </React.Fragment>
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
      coverScreen={false}
    >
      <ScrollView style={styles.container}>
        {renderImage()}
        {renderControl()}
        {renderBasicInfo()}
        {renderContent()}
        {renderHost()}
        {renderGoingList()}
        {renderInterestedList()}
        {renderQRCode()}
        {renderModal()}
      </ScrollView>
    </Modal>
  );
};

export default forwardRef(Detail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
    elevation: elevation.MODAL,
  },
  dotImage: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(8),
    marginHorizontal: scale(10),
    padding: 0,
    margin: 0,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: scale(60),
    aspectRatio: 1,
    borderRadius: scale(30),
    ...shadow,
  },
  controlIcon: {
    fontSize: scale(30),
    marginRight: scale(5),
  },
  controlBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: space.componentMargin,
    left: space.componentMargin,
    right: space.componentMargin,
  },
  basicBox: {
    padding: space.componentMargin,
    paddingBottom: 0,
  },
  timeText: {
    fontWeight: "bold",
    color: color.disable,
  },
  titleText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
    padding: 0,
  },
  placeText: {
    color: color.disable,
  },
  interestedText: {},
  actionBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: space.componentMargin * 2,
    marginTop: space.componentMargin * 2,
    marginBottom: space.componentMargin,
  },
  actionIconBox: {
    width: scale(80),
    aspectRatio: 1,
    borderRadius: scale(50),
    backgroundColor: color.lightGreyPlus,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(10),
  },
  actionIcon: (iconColor) => {
    return {
      fontSize: scale(40),
      color: iconColor,
    };
  },
  actionText: (disabled) => ({
    color: disabled ? color.disable : color.text,
    fontSize: fontSize.size28,
  }),
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.itemMargin,
  },
  iconInfo: {
    fontSize: scale(50),
    color: color.grey,
  },
  iconInfoBox: {
    marginRight: space.componentMargin,
    width: scale(60),
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textInfo: {
    flex: 1,
    fontSize: fontSize.sizeBigContent,
    padding: 0,
    textAlign: "left",
  },
  contentBox: {
    borderTopWidth: scale(1),
    borderColor: color.hint,
    padding: space.componentMargin,
  },
  titleContent: {
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    marginBottom: space.componentMargin,
  },
  textContent: {},
  memberBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.itemMargin,
  },
  editInput: {
    borderBottomWidth: scale(1),
    borderColor: color.hint,

    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
    marginVertical: space.itemMargin,
    padding: 0,
  },
  penEditBox: {
    width: scale(24),
    height: scale(24),
  },
  penEditIcon: { fontSize: fontSize.size24, color: color.primary },
});
