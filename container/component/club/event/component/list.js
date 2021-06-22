import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  color,
  scale,
  space,
  fontSize,
  shadow,
} from "container/variables/common";
import { Icon } from "native-base";
import Messages from "container/translation/Message";
import ActionButton from "container/component/ui/actionButton";
import { injectIntl } from "react-intl";
import CreateEvent from "./create";
import DetailEvent from "./detail";
import {
  formatHumanDate,
  formatPlace,
  formatInterested,
  interestEvent,
  goingToEvent,
} from "../utils";
import { currEventState, listEventState, modeState } from "../recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import ModalContext from "container/context/modal";
import update from "immutability-helper";
import EmptyData from "container/component/ui/emptyData";
import { gotoRoute } from "../../../../utils/router";
import { screens } from "container/constant/screen";

const List = (props) => {
  const { intl } = props;

  //state
  const [data, setData] = useRecoilState(listEventState);
  const [meta, setMeta] = useState({});
  const setCurrEvent = useSetRecoilState(currEventState);
  const setMode = useSetRecoilState(modeState);

  //variables
  let page = 1;
  const { member: currMember } = global.organization || {};

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //ref
  const createEventRef = useRef(null);
  const detailEventRef = useRef(null);

  //hooks -----------------------------------------------------------------------------------------------
  useEffect(() => {
    getData();
  }, []);

  //function --------------------------------------------------------------------------------------------
  const openCreateEvent = () => {
    createEventRef && createEventRef.current.show();
  };

  const gotoDetail = (item, index) => {
    setCurrEvent({ ...item, index });
    detailEventRef && detailEventRef.current.show();
  };

  const getData = (page = 1) => {
    showSpinner();
    getRequest("event/get", { page })
      .then((res) => {
        if (res && res.data) {
          console.log("getData:::", res.data);
          setData(res.data.items);
          setMeta(res.data.meta);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const loadMore = () => {
    if (page < meta.total_page) getData(++page);
  };

  const callbackInterestGoing = (index, resData) => {
    setData(update(data, { [index]: { $set: resData } }));
  };

  //render ----------------------------------------------------------------------------------------------
  const renderItem = (item, index) => {
    const timeValue = formatHumanDate(
      item.status,
      item.start_date,
      item.end_date
    );
    const nameValue = item.name;
    const placeValue = formatPlace(item.is_online, item.place);
    const interestedValue = formatInterested(
      item.interested_menbers,
      item.participant_members
    );

    const isInterested =
      item.interested_ids &&
      item.interested_ids.findIndex((i) => i == currMember.id) >= 0
        ? true
        : false;

    const isGoing =
      item.participant_ids &&
      item.participant_ids.findIndex((i) => i == currMember.id) >= 0
        ? true
        : false;

    return (
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => gotoDetail(item, index)}
      >
        {item.image_paths && item.image_paths.length ? (
          <Image
            source={{
              uri: Config().API_IMAGE.concat(
                `event/${item.image_paths[0]}.jpg`
              ),
            }}
            style={styles.image}
          />
        ) : null}
        <View style={styles.contentBox}>
          <Text style={styles.timeText} numberOfLines={1}>
            {timeValue}
          </Text>
          <Text style={styles.titleText} numberOfLines={2}>
            {nameValue}
          </Text>
          <Text style={styles.placeText} numberOfLines={2}>
            {placeValue}
          </Text>
          <Text style={styles.interestedText}>{interestedValue}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: space.itemMargin,
          }}
        >
          {renderActionBtn(
            intl.formatMessage(Messages.interested),
            { name: "star", type: "FontAwesome" },
            () =>
              interestEvent(item.id ? item.id : null, isInterested, (resData) =>
                callbackInterestGoing(index, resData)
              ),
            isInterested
          )}
          {renderActionBtn(
            intl.formatMessage(Messages.going),
            { name: "check-circle", type: "FontAwesome" },
            () =>
              goingToEvent(item.id ? item.id : null, isGoing, (resData) =>
                callbackInterestGoing(index, resData)
              ),
            isGoing,
            true
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderActionBtn = (title, icon, onPress, isActive, applyMargin) => {
    return (
      <TouchableOpacity
        style={styles.actionBtnBox(applyMargin)}
        onPress={onPress}
      >
        <Icon
          name={icon.name}
          type={icon.type}
          style={{
            fontSize: scale(30),
            color: isActive ? color.background : color.text,
          }}
        />
        <Text
          style={[
            styles.textActionBtn,
            { color: isActive ? color.background : color.text },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingBottom: scale(70) }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderItem(item, index)}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListEmptyComponent={<EmptyData />}
      />
      <ActionButton
        title={intl.formatMessage(Messages.create)}
        style={styles.createBox}
        icon={<Icon name="plus" type="Entypo" style={styles.createIcon} />}
        onPress={() => openCreateEvent()}
      />
      <CreateEvent ref={createEventRef} />
      <DetailEvent ref={detailEventRef} />
    </View>
  );
};

export default injectIntl(List);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemBox: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    margin: space.componentMargin,
    ...shadow,
  },
  timeText: {
    fontWeight: "bold",
    color: color.disable,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
  },
  placeText: {
    color: color.disable,
  },
  interestedText: {
    color: color.disable,
  },
  actionBtnBox: (applyMargin) => ({
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.itemMargin,
    paddingHorizontal: space.componentMargin,
    borderRadius: space.border,
    backgroundColor: color.lightGreyPlus,
    marginLeft: applyMargin ? space.itemMargin : 0,
  }),
  createBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scale(15),
    bottom: 0,
    left: 0,
    right: 0,
  },
  createIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
  textActionBtn: {
    marginLeft: scale(10),
    fontSize: fontSize.size30,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1.7,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
  },
  contentBox: {
    padding: space.itemMargin,
    paddingBottom: 0,
  },
});
