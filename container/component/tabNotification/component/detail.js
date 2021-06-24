import React, { forwardRef, useImperativeHandle, useState } from "react";
import ModalPopUp from "container/component/ui/modalPopUp";
import { View, Text } from "react-native";
import Messages from "container/translation/Message";
import { getRequest } from "../../../utils/request";
import Avatar from "container/component/ui/avatar";
import styles from "../style/detail";
import { scale } from "container/variables/common";

export const AVATAR_SIZE = scale(60);

const Detail = (props, ref) => {
  const { intl } = props;

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  const show = (data) => {
    getData(data.id);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const getData = (id) => {
    getRequest("notification/detail", { id }).then((res) => {
      if (res && res.data) {
        setData(res.data);
      }
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
      visible={visible}
      transparent
      animationType="fade"
      maskClose={() => {
        hide();
      }}
      onClose={() => {
        hide();
      }}
      width="90%"
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
