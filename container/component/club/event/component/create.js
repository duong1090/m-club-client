import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BottomPopUp from "container/component/ui/bottomPopUp";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import { Icon, ScrollableTab, Tab, Tabs, View } from "native-base";
import InputItem from "container/component/ui/inputItem";
import moment from "moment";
import Config from "container/config/server.config";
import { postRequest } from "container/utils/request";
import ImagePicker from "react-native-image-crop-picker";
import update from "immutability-helper";
import Toast from "react-native-simple-toast";
import ModalContext from "container/context/modal";
import { listEventState } from "../recoil";
import { useRecoilState } from "recoil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIphoneX } from "../../../../variables/common";

const DEFAULT_VALUE = {
  name: "",
  start_date: null,
  end_date: null,
  content: "",
  url_link: "",
  price: null,
  place: null,
  image: [],
};

const Create = (props, ref) => {
  //state
  const [type, setType] = useState(null);
  const [tab, setTab] = useState(0);
  const [formValue, setFormValue] = useState(DEFAULT_VALUE);

  //recoil
  const [list, setList] = useRecoilState(listEventState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //ref
  const bottomPopUpRef = useRef(null);
  const intl = getIntl();

  //hooks ----------------------------------------------------------------------------------------
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function -------------------------------------------------------------------------------------
  const show = () => {
    bottomPopUpRef.current.show();
  };

  const hide = () => {
    bottomPopUpRef.current.hide();
  };

  const resetFields = () => {
    setFormValue(DEFAULT_VALUE), setType(null);
    setTab(0);
  };

  const create = () => {
    showSpinner();
    const params = prepareParams();
    postRequest("event/create", params)
      .then((res) => {
        console.log("create:::", res);
        if (res && res.data) {
          createSuccess(res.data);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const createSuccess = (data) => {
    setList(update(list, { $unshift: [data] }));
    Toast.show(intl.formatMessage(Messages.create_success), Toast.SHORT);
    hide();
  };

  const prepareParams = () => {
    let params = new FormData();
    Object.keys(formValue).map((key) => {
      const keyValue = formValue[key];
      if (keyValue != null) {
        if (key == "image") {
          keyValue.map((item, index) => {
            params.append(`images[${index}]`, item.data);
          });
          params.append("count", keyValue.length);
        } else params.append(key, formValue[key]);
      }
    });
    const is_online = type == "online" ? 1 : 0;
    params.append("is_online", is_online);
    return params;
  };

  const onSelectType = (type) => {
    setType(type);
    setTab(1);
  };

  const onChangeField = (fieldName, value) => {
    let temp = { ...formValue };
    temp[fieldName] = value;
    setFormValue(temp);
  };

  const selectImage = () => {
    // const options = {
    //   mediaType: "photo",
    //   maxWidth: scale(500),
    //   maxHeight: scale(500),
    //   quality: 1,
    //   includeBase64: true,
    // };
    // launchImageLibrary(options, (img) => {
    //   if (img && img.base64)
    //     setFormValue(update(formValue, { image: { $push: [img] } }));
    // });

    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then((images) => {
      console.log("imagePicker::::", images);
      if (images && images.length)
        setFormValue(update(formValue, { image: { $push: images } }));
    });
  };

  const removeImage = (index) => {
    setFormValue(update(formValue, { image: { $splice: [[index, 1]] } }));
  };

  const preValidate = () => {
    const notFillRequired =
      INPUT.findIndex(
        (item) =>
          item.required &&
          ((type == "online" && item.isOnline) ||
            (type == "offline" && item.isOffline)) &&
          (!formValue[item.fieldName] || formValue[item.fieldName] == "")
      ) >= 0
        ? true
        : false;

    if (notFillRequired)
      Toast.show(intl.formatMessage(Messages.pls_fill_required), Toast.LONG);
    else create();
  };

  //render ---------------------------------------------------------------------------------------
  const INPUT = [
    {
      fieldName: "name",
      label: intl.formatMessage(Messages.name),
      required: true,
      placeholder: intl.formatMessage(Messages.name_placeholder),
      onChangeText: (value) => onChangeField("name", value),
      isOnline: true,
      isOffline: true,
    },
    {
      fieldName: "start_date",
      type: "button",
      label: intl.formatMessage(Messages.start_date),
      required: true,
      formatValue: intl.formatMessage(Messages.datetime_format),
      modalObj: {
        type: "date",
        typePicker: "date_time",
        valuePicker: moment().format("YYYY-MM-DD HH:mm:ss"),
        key: "start_date",
        onDone: (value) => onChangeField("start_date", value),
      },
      isOnline: true,
      isOffline: true,
    },
    {
      fieldName: "end_date",
      type: "button",
      label: intl.formatMessage(Messages.end_date),
      required: true,
      formatValue: intl.formatMessage(Messages.datetime_format),
      modalObj: {
        type: "date",
        typePicker: "date_time",
        valuePicker: moment().format("YYYY-MM-DD HH:mm:ss"),
        key: "end_date",
        onDone: (value) => onChangeField("end_date", value),
      },
      isOnline: true,
      isOffline: true,
    },
    {
      fieldName: "url_link",
      label: intl.formatMessage(Messages.link),
      onChangeText: (value) => onChangeField("url_link", value),
      required: true,
      placeholder: `${intl.formatMessage(
        Messages.example
      )}: https://google.com`,
      isOnline: true,
    },
    {
      fieldName: "place",
      label: intl.formatMessage(Messages.place),
      required: true,
      placeholder: `${intl.formatMessage(
        Messages.example
      )}: 01 Võ Văn Ngân, Thủ Đức, Hò Chí Minh`,
      onChangeText: (value) => onChangeField("place", value),
      isOffline: true,
    },
    {
      fieldName: "price",
      label: intl.formatMessage(Messages.price),
      onChangeText: (value) => onChangeField("price", value),
      placeholder: `${intl.formatMessage(Messages.example)}: 100000`,
      keyboardType: "numeric",
      note: intl.formatMessage(Messages.price_event_note),
      isOnline: true,
      isOffline: true,
    },
    {
      fieldName: "content",
      type: "text_area",
      label: intl.formatMessage(Messages.content),
      required: true,
      onChangeText: (value) => onChangeField("content", value),
      isOnline: true,
      isOffline: true,
    },
  ];

  const renderBody = () => {
    return (
      <Tabs
        initialPage={tab}
        page={tab}
        locked
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, borderBottomColor: "#fff" }} />
        )}
      >
        <Tab heading="">{renderSelectType()}</Tab>
        <Tab heading="">
          {renderForm()}
          <TouchableOpacity
            onPress={() => preValidate()}
            style={styles.createButton}
          >
            <Text style={styles.textCreateButton}>
              {intl.formatMessage(Messages.add)}
            </Text>
          </TouchableOpacity>
        </Tab>
      </Tabs>
    );
  };

  const renderSelectType = () => {
    return (
      <View style={{ flex: 1, padding: scale(15) }}>
        {renderType(
          "Online",
          { name: "globe", type: "FontAwesome" },
          "this is description",
          () => onSelectType("online")
        )}
        {renderType(
          "Offline",
          { name: "place", type: "MaterialIcons" },
          "this is description",
          () => onSelectType("offline")
        )}
      </View>
    );
  };

  const renderForm = () => {
    switch (type) {
      case "online":
        return renderOnline();
      case "offline":
        return renderOffline();
    }
  };

  const renderOnline = () => {
    return (
      <ScrollView>
        <FlatList
          data={INPUT}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            item.isOnline ? (
              <InputItem
                label={item.label}
                style={styles.inputStyle}
                type={item.type}
                required={item.required}
                placeholder={item.placeholder}
                onPress={item.onPress}
                onChangeText={item.onChangeText}
                value={formValue[item.fieldName]}
                modalObj={item.modalObj}
                formatValue={item.formatValue}
                keyboardType={item.keyboardType}
                note={item.note}
              />
            ) : null
          }
        />
        {renderImageList()}
      </ScrollView>
    );
  };

  const renderOffline = () => {
    return (
      <ScrollView>
        <FlatList
          data={INPUT}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            item.isOffline ? (
              <InputItem
                label={item.label}
                style={styles.inputStyle}
                type={item.type}
                required={item.required}
                placeholder={item.placeholder}
                onPress={item.onPress}
                onChangeText={item.onChangeText}
                value={formValue[item.fieldName]}
                modalObj={item.modalObj}
                formatValue={item.formatValue}
                keyboardType={item.keyboardType}
                note={item.note}
              />
            ) : null
          }
        />
        {renderImageList()}
      </ScrollView>
    );
  };

  const renderImageList = () => {
    return (
      <View style={styles.imgListBox}>
        {formValue.image.length ? (
          <FlatList
            horizontal
            data={formValue.image}
            contentContainerStyle={{
              paddingVertical: space.componentMargin,
              paddingRight: space.componentMargin,
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderImageItem(item, index)}
          />
        ) : null}
        {renderImageAdding()}
      </View>
    );
  };

  const renderImageAdding = () => {
    return (
      <TouchableOpacity style={styles.addImgBox} onPress={() => selectImage()}>
        <Icon
          name="images"
          type="FontAwesome5"
          style={{ color: color.hint, fontSize: scale(50) }}
        />
        <Text style={styles.textAddImg}>
          {intl.formatMessage(Messages.add) +
            " " +
            intl.formatMessage(Messages.image).toLowerCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderImageItem = (image, index) => {
    return (
      <View style={styles.itemImgBox}>
        <Image
          source={{ uri: image.path }}
          resizeMode="cover"
          style={styles.itemImg}
        />
        <TouchableOpacity
          onPress={() => removeImage(index)}
          style={styles.itemImgIconBox}
        >
          <View pointerEvents="none" style={styles.itemImgIcon}>
            <Icon name="cross" type="Entypo" style={{ fontSize: scale(40) }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderType = (title, icon, description, onPress) => {
    return (
      <TouchableOpacity style={styles.typeBox} onPress={onPress}>
        <View style={styles.leftTypeBox}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: scale(50),
              aspectRatio: 1,
            }}
          >
            <Icon
              name={icon.name}
              type={icon.type}
              style={{ fontSize: scale(50) }}
            />
          </View>
          <Text style={styles.titleTypeBox}>{title}</Text>
          <Text style={styles.desTypeBox}>{description}</Text>
        </View>
        <Icon
          name="caret-right"
          type="FontAwesome"
          style={{ fontSize: scale(50), color: color.hint }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <BottomPopUp
      ref={bottomPopUpRef}
      reset={resetFields}
      title={intl.formatMessage(Messages.create_title, {
        title: intl.formatMessage(Messages.event).toLowerCase(),
      })}
      body={
        <KeyboardAwareScrollView>
          <View style={styles.bodyBox}>{renderBody()}</View>
        </KeyboardAwareScrollView>
      }
    />
  );
};

export default forwardRef(Create);

const styles = StyleSheet.create({
  bodyBox: {
    height: scale(800),
    marginHorizontal: -space.componentMargin,
    marginBottom: isIphoneX ? 0 : -space.componentMargin,
  },
  createButton: {
    flex: 1,
    padding: scale(40),
    marginHorizontal: space.componentMargin,
    marginVertical: space.itemMargin,
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    color: "#fff",
    height: scale(40),
  },

  typeBox: {
    backgroundColor: "#fff",
    padding: space.itemMargin,
    paddingHorizontal: space.componentMargin,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: space.border,
    marginTop: space.itemMargin,
    marginHorizontal: space.componentMargin,
    ...shadow,
  },
  leftTypeBox: {},
  titleTypeBox: {
    fontWeight: "bold",
  },
  desTypeBox: {
    color: color.hint,
  },
  inputStyle: {
    marginBottom: space.componentMargin,
    marginHorizontal: space.componentMargin,
  },
  itemImgBox: {
    marginLeft: space.componentMargin,
  },
  itemImgIconBox: {
    position: "absolute",
    top: scale(-25),
    right: scale(-25),
  },
  itemImgIcon: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: color.hint,

    justifyContent: "center",
    alignItems: "center",
  },
  itemImg: {
    width: scale(400),
    height: scale(300),
    borderRadius: space.border,
  },
  imgListBox: {
    borderTopWidth: scale(1),
    borderColor: color.hint,
    alignItems: "center",
    paddingVertical: space.bgPadding,
  },
  addImgBox: {
    marginTop: space.componentMargin,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scale(2),
    borderColor: color.hint,
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    borderRadius: space.border,
    borderStyle: "dashed",
    backgroundColor: color.light,
  },
  textAddImg: {
    color: color.hint,
  },
});
