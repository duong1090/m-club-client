import React, { forwardRef, useImperativeHandle, useState } from "react";
import ModalPopUp from "container/component/ui/modalPopUp";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";
import Messages from "container/translation/Message";
import { getIntl } from "container/utils/common";
import { Icon } from "native-base";
export const AVATAR_SIZE = scale(60);

const intl = getIntl();

const FundDetail = (props, ref) => {
  //state
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  //effect
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event
  const show = (passData) => {
    setVisible(true);
    setData(passData);
  };

  const hide = () => {
    setVisible(false);
  };

  const renderAvatar = () => {
    return (
      <TouchableOpacity onPress={() => {}} style={styles.avatarBox}>
        <Text numberOfLines={2} style={styles.memberName}>
          {data.implement_user.name}
        </Text>
        <Avatar size={AVATAR_SIZE} data={data.implement_user} />
      </TouchableOpacity>
    );
  };

  return (
    <ModalPopUp
      title="Chi tiết"
      visible={visible}
      transparent
      animationType="fade"
      maskClose={() => {
        setVisible(false);
      }}
      onClose={() => {
        setVisible(false);
      }}
      width="90%"
    >
      {data ? (
        <View style={styles.container}>
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle}>Người thực hiện</Text>
            {renderAvatar()}
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle}>Hoạt động</Text>
            <View style={styles.contentBox}>
              <Text style={styles.itemText}>
                {data.is_revenue
                  ? intl.formatMessage(Messages.revenue)
                  : intl.formatMessage(Messages.pay)}
              </Text>
              <Icon
                type="Foundation"
                name={data.is_revenue ? "arrow-right" : "arrow-left"}
                style={styles.itemRevenue(data.is_revenue)}
              />
            </View>
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle}>Số tiền</Text>
            <View style={styles.contentBox}>
              <Text style={styles.itemText}>{data.amount}</Text>
              <Icon type="FontAwesome5" name="coins" style={styles.icon} />
            </View>
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle}>Thời gian</Text>
            <View style={styles.contentBox}>
              <Text style={styles.itemText}>{data.time}</Text>
              <Icon name="time" style={styles.icon} />
            </View>
          </View>
          <View style={styles.reasonBox}>
            <Text style={styles.itemTitle}>Mục đích</Text>
            <Text style={styles.itemText}>{data.reason}</Text>
          </View>
        </View>
      ) : null}
    </ModalPopUp>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
  },
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.itemMargin,
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
    paddingBottom: scale(10),
  },
  itemTitle: {
    ...defaultText,
    fontWeight: "bold",
  },
  itemText: {
    ...defaultText,
  },
  avatarBox: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  memberName: {
    ...defaultText,
    maxWidth: "75%",
    marginRight: space.itemMargin,
  },
  itemRevenue: (isRevenue) => ({
    color: isRevenue ? color.success : color.danger,
    fontSize: scale(30),
    marginLeft: scale(20),
  }),
  icon: {
    color: color.grey,
    fontSize: scale(30),
    marginLeft: scale(20),
  },
  contentBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reasonBox: {
      
  },
});

export default forwardRef(FundDetail);