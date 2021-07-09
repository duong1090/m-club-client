import React, { useState } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Icon } from "native-base";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import Messages from "container/translation/Message";
import { clubListState, certificateState, activeTabState } from "../recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import update from "immutability-helper";

const TAB_INPUT_OTP = 2;

const SelectClub = (props) => {
  const { intl, style } = props;

  //recoil state
  const [clubList, setClubList] = useRecoilState(clubListState);
  const [certificate, setCertificate] = useRecoilState(certificateState);
  const setActiveTab = useSetRecoilState(activeTabState);

  const onPressItem = (item, index) => {
    const temp = clubList.map((item, i) => {
      let tempItem = { ...item };
      if (i == index) tempItem.selected = true;
      else tempItem.selected = false;
      return tempItem;
    });
    setClubList(update(clubList, { $set: temp }));
  };

  const gotoInputOTP = () => {
    const selectedClub = clubList.find((item) => item.selected);
    setActiveTab(TAB_INPUT_OTP);
    setCertificate({
      ...certificate,
      club_id: selectedClub && selectedClub.id ? selectedClub.id : null,
    });
  };

  const clubItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item, index)}
        style={[
          styles.item,
          {
            borderColor: item.selected ? color.blue : color.disable,
          },
        ]}
      >
        <Text
          style={[
            styles.titleItem,
            { color: item.selected ? color.blue : color.disable },
          ]}
        >
          {item.name}
        </Text>
        <View style={styles.descriptionItem}>
          <Text
            style={[
              styles.codeItem,
              { color: item.selected ? color.blue : color.disable },
            ]}
          >
            {item.code}
          </Text>
          <View
            style={[
              styles.checkIcon,
              { backgroundColor: item.selected ? color.blue : "#fff" },
            ]}
          >
            <Icon
              name="checkmark"
              style={{ fontSize: scale(35), color: "#fff" }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  console.log("SelectClub:::", clubList);

  return (
    <Animated.View style={style}>
      <Text style={styles.title}>
        {intl.formatMessage(Messages.select_club)}
      </Text>
      <ScrollView horizontal>
        <View style={styles.list}>
          {clubList.map((item, index) => clubItem(item, index))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.background }]}
        onPress={() => gotoInputOTP()}
      >
        <Text style={{ color: "#fff", fontSize: fontSize.size28 }}>
          {intl.formatMessage(Messages.next)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: space.border,
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: space.componentMargin,
    marginHorizontal: space.componentMargin,
  },

  title: {
    marginBottom: space.componentMargin,
    alignSelf: "center",
    fontSize: fontSize.size36,
    color: color.background,
    fontWeight: "bold",
  },

  list: {
    flex: 1,
    flexWrap: "wrap",
    paddingHorizontal: space.componentMargin / 2,
    paddingVertical: space.componentMargin,
  },

  item: {
    backgroundColor: "#fff",
    width: scale(330),
    padding: scale(20),
    borderRadius: scale(20),
    marginBottom: space.componentMargin,
    marginHorizontal: space.componentMargin / 2,
    ...shadow,
  },

  descriptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleItem: {
    marginBottom: scale(10),
    fontSize: fontSize.size32,
    fontWeight: "bold",
  },

  codeItem: {
    fontSize: fontSize.size24,
  },

  checkIcon: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: scale(2),
    borderColor: color.background,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default injectIntl(SelectClub);
