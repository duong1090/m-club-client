import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { postRequest } from "container/utils/request";
import Modal from "react-native-modal";
import { elevation, screens } from "../../../../../constant/screen";
import { listEventState } from "../../recoil";
import { useRecoilState } from "recoil";
import { QR_EVENT } from "../../../../../constant/qrdecode";
import Toast from "react-native-simple-toast";
import update from "immutability-helper";
import { getIntl } from "../../../../../utils/common";
import Message from "../../../../../translation/Message";
import QRScanner from "container/component/ui/qrCodeScanner";
import {
  color,
  scale,
  defaultText,
  space,
  fontSize,
  shadow,
} from "container/variables/common";
import { Icon } from "native-base";
import { Navigation } from "react-native-navigation";

const QRScannerEvent = (props, ref) => {
  //state
  const [visible, setVisible] = useState(false);
  const [listEvent, setListEvent] = useRecoilState(listEventState);

  //variables
  const { member } = global.organization || {};
  const intl = getIntl();

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function ----------------------------------------------------------------------------------------------------------
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

  const onRead = (data) => {
    const memberId = member && member.id ? member.id : undefined;

    const splitData = data && data.data ? data.data.split(",") : [];

    if (splitData[0] == QR_EVENT) {
      const eventId = splitData[1] ? splitData[1] : undefined;

      if (memberId && memberId == MONGO_ID_LENGTH)
        postRequest("event/attendance", {
          event_id: eventId,
          member_id: memberId,
        })
          .then((res) => {
            if (res && res.data) {
              const eventIndex = listEvent.findIndex((i) => i.id == eventId);
              setListEvent(
                update(listEvent, {
                  [eventIndex]: {
                    attendanced_members: { $unshift: [res.data] },
                  },
                })
              );
              Toast.show(
                intl.formatMessage(Message.check_in_successfully),
                Toast.LONG
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });
    }
  };

  //render ------------------------------------------------------------------------------------------------------------
  const renderScanner = () => {
    return (
      <QRScanner
        key="attendance_event"
        cameraStyle={{ height: "100%" }}
        onRead={onRead}
        reactivate={true}
        reactivateTimeout={1000}
      />
    );
  };

  const renderNote = () => {
    return (
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          {intl.formatMessage(Message.attendance_event_note)}
        </Text>
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

  return (
    <Modal
      isVisible={visible}
      style={styles.modalWrapper}
      backdropOpacity={0.5}
      onBackdropPress={() => hide()}
      useNativeDriver={true}
      coverScreen={false}
      propagateSwipe
    >
      <SafeAreaView style={styles.container}>
        {renderScanner()}
        {renderNote()}
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
  noteBox: {
    position: "absolute",
    backgroundColor: "#00000055",
    borderRadius: space.border,
    padding: space.componentMargin,
    paddingVertical: scale(20),
    bottom: space.componentMargin,
    left: space.componentMargin,
    right: space.componentMargin,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    ...defaultText,
    color: "#fff",
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
});

export default forwardRef(QRScannerEvent);
