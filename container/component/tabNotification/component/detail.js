import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import ModalPopUp from "container/component/ui/modalPopUp";
import { View, Text } from "react-native";
import Messages from "container/translation/Message";
import { getRequest } from "../../../utils/request";
import Avatar from "container/component/ui/avatar";
import styles from "../style/detail";
import { scale } from "container/variables/common";
import { Navigation } from "react-native-navigation";
import { screens } from "../../../constant/screen";
import ModalContext from "../../../context/modal";

export const AVATAR_SIZE = scale(60);

const Detail = (props, ref) => {
  const { intl } = props;

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  const { showSpinner, hideSpinner } = useContext(ModalContext);

  const show = (data) => {
    getData(data.id);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    resetState();
    Navigation.updateProps(screens.TAB_NOTIFICATION, { mode: "list" });
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const resetState = () => {
    setData({});
  };

  const getData = (id) => {
    showSpinner();
    getRequest("notification/detail", { id })
      .then((res) => {
        if (res && res.data) {
          setData(res.data);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const renderAvatar = () => {
    console.log("renderAvatar:::", data);

    return (
      <View style={styles.avatarBox}>
        <Text numberOfLines={2} style={styles.memberName}>
          {data.implement_name}
        </Text>
        <Avatar
          noShadow
          size={AVATAR_SIZE}
          data={{ id: data.implement_user, name: data.implement_name }}
        />
      </View>
    );
  };

  return (
    <ModalPopUp
      title={intl.formatMessage(Messages.detail)}
      isVisible={visible}
      onClose={() => hide()}
      style={{ minHeight: scale(700) }}
    >
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>{data.title}</Text>
        </View>
        <View style={styles.itemBox}>
          <Text style={styles.itemTitle}>
            {intl.formatMessage(Messages.implementer)}
          </Text>
          {renderAvatar()}
        </View>
        <View>
          <Text style={styles.itemTitle}>
            {intl.formatMessage(Messages.content)}
          </Text>
          <Text style={styles.itemText}>{data.content}</Text>
        </View>
      </View>
    </ModalPopUp>
  );
};

export default forwardRef(Detail);
