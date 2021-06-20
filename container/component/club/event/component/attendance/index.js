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
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

import {
  scale,
  
  space,
  fontSize,
  shadow,
} from "container/variables/common";
import { Icon } from "native-base";
import { isIphoneX } from "../../../../../variables/common";

const MONGO_ID_LENGTH = 24;

const Attendance = (props, ref) => {
  //state

  const [visible, setVisible] = useState(false);
  const [currEvent, setCurrEvent] = useRecoilState(currEventState);
  const [listEvent, setListEvent] = useRecoilState(listEventState);

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
    const splitData = data && data.data ? data.data.split(",") : [];

    if (splitData[0] == QR_MEMBER) {
      const memberId = splitData[1] || "nothing";

      if (memberId && memberId == MONGO_ID_LENGTH)
        postRequest("event/attendance", {
          event_id: currEvent.id,
          member_id: memberId,
        })
          .then((res) => {
            if (res && res.data) {
              setCurrEvent(
                update(currEvent, {
                  attendanced_members: { $unshift: [res.data] },
                })
              );
              setListEvent(
                update(listEvent, {
                  [currEvent.index]: {
                    attendanced_members: { $unshift: [res.data] },
                  },
                })
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });
    }
  };

  //render ------------------------------------------------------------------------------------------
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
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <LinearGradient
              colors={["#FFFFFF00", "#FFFFFF", "#FFFFFF00"]}
              style={styles.linearView}
            />
          }
        >
          <FlatList
            data={currEvent.attendanced_members}
            contentContainerStyle={{
              paddingVertical: space.componentMargin * 2,
            }}
            key={(item, index) => index.toString()}
            renderItem={({ item }) => renderItem(item)}
            showsVerticalScrollIndicator={false}
          />
        </MaskedView>
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

  const renderTotal = () => {
    return (
      <View style={styles.totalBox}>
        <Text style={styles.textTotal}>
          {currEvent.attendanced_members &&
          currEvent.attendanced_members.length != null
            ? currEvent.attendanced_members.length
            : 0}
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
        {renderList()}
        {renderTotal()}
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
  linearView: {
    flex: 1,
    width: "100%",
    borderRadius: 5,
  },
  totalBox: {
    position: "absolute",
    right: space.componentMargin,
    bottom: isIphoneX ? scale(110) : space.componentMargin,
    backgroundColor: "#00000055",
    padding: space.componentMargin,
    paddingVertical: scale(5),
    borderRadius: space.border,
  },
  textTotal: {
    
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.sizeContent,
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
});

export default forwardRef(Attendance);
