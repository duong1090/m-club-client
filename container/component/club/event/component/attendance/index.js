import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import QRScanner from "container/component/ui/qrCodeScanner";
import { postRequest } from "container/utils/request";
import Avatar from "container/component/ui/avatar";
import { currEventState, listEventState } from "../../recoil";
import update from "immutability-helper";
import { elevation } from "../../../../../constant/screen";
import { useRecoilState } from "recoil";
import { QR_MEMBER } from "../../../../../constant/qrdecode";
import { getIntl } from "../../../../../utils/common";
import Messages from "../../../../../translation/Message";
import Toast from "react-native-simple-toast";

import { scale, space, fontSize, shadow } from "container/variables/common";
import { Icon } from "native-base";
import { isIphoneX } from "../../../../../variables/common";
import FadedWrapper from "../../../../ui/fadedWrapper";

const MONGO_ID_LENGTH = 24;

const Attendance = (props, ref) => {
  //state

  const [visible, setVisible] = useState(false);
  const [currEvent, setCurrEvent] = useRecoilState(currEventState);
  const [listEvent, setListEvent] = useRecoilState(listEventState);

  //variables
  const intl = getIntl();

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function ----------------------------------------------------------------------------------------
  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const onRead = (data) => {
    const splitData = data ? data.split(",") : [];
    console.log("onRead:::", data, splitData);

    if (splitData[0] == QR_MEMBER) {
      const memberId = splitData[1] || "nothing";

      if (memberId && memberId.length == MONGO_ID_LENGTH)
        postRequest("event/attendance", {
          event_id: currEvent.id,
          member_id: memberId,
        })
          .then((res) => {
            if (res && res.data) {
              setCurrEvent(
                update(currEvent, {
                  attendanced_members: {
                    $unshift: [res.data],
                  },
                })
              );
              setListEvent(
                update(listEvent, {
                  [currEvent.index]: {
                    attendanced_members: { $unshift: [res.data] },
                  },
                })
              );
            } else {
              Toast.show(
                intl.formatMessage(Messages.already_check_in),
                Toast.LONG
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });
    }
  };

  //render ------------------------------------------------------------------------------------------
  const renderHeader = () => {
    return (
      <View style={styles.headerBox}>
        <View style={styles.headerTextBox}>
          <Text style={styles.textName}>{currEvent.name}</Text>
        </View>
        <View style={[styles.headerTextBox, { flexDirection: "column" }]}>
          <Text style={styles.textTotalName}>
            {intl.formatMessage(Messages.attended)}{" "}
          </Text>
          <Text style={styles.textTotal}>
            {currEvent.attendanced_members &&
            currEvent.attendanced_members.length != null
              ? currEvent.attendanced_members.length
              : 0}
          </Text>
        </View>
      </View>
    );
  };

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
      </View>
    );
  };

  const renderScanner = () => {
    return (
      <QRScanner
        key="attendance_member"
        cameraStyle={{ height: "100%" }}
        onRead={onRead}
        reactivate={true}
        reactivateTimeout={1000}
      />
    );
  };

  const renderList = () => {
    return (
      <View style={styles.listBox}>
        <FadedWrapper>
          <FlatList
            data={currEvent.attendanced_members}
            contentContainerStyle={{
              paddingVertical: space.componentMargin * 2,
            }}
            key={(item, index) => index.toString()}
            renderItem={({ item }) => renderItem(item)}
            showsVerticalScrollIndicator={false}
          />
        </FadedWrapper>
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemBox}>
        <Avatar size={scale(50)} data={item} noShadow />
        <Text numberOfLines={1} style={styles.textItem}>
          {item.name}
        </Text>
      </View>
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
    >
      <SafeAreaView style={styles.container}>
        {renderScanner()}
        {renderHeader()}
        {renderList()}
        {/* {renderTotal()} */}
        {renderControl()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
    elevation: elevation.MODAL,
  },
  itemBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(10),
    padding: scale(10),
    backgroundColor: "#00000055",
    paddingHorizontal: scale(20),
    borderRadius: space.border,
  },
  textItem: {
    marginLeft: scale(10),
    color: "#fff",
  },
  listBox: {
    position: "absolute",
    width: "50%",
    height: "30%",
    bottom: 0,
    left: space.componentMargin,
  },
  gradientTop: {
    position: "absolute",
    height: scale(40),
    left: 0,
    right: 0,
    top: 0,
  },
  textTotal: {
    color: "#fff",
    fontSize: scale(100),
  },
  textTotalName: {
    color: "#ccc",
    fontWeight: "bold",
    fontSize: fontSize.size30,
  },
  controlBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: isIphoneX ? scale(110) : space.componentMargin,
    left: space.componentMargin,
    right: space.componentMargin,
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
  headerBox: {
    position: "absolute",
    top: scale(100),
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.componentMargin,
  },
  textName: {
    color: "#fff",
    fontSize: fontSize.size50,
    fontWeight: "bold",
  },
});

export default forwardRef(Attendance);
