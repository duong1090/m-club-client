import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tabs, Tab, ScrollableTab } from "native-base";
import Messages from "container/translation/Message";
import { scale, color, fontSize, space } from "container/variables/common";
import InputPhone from "./InputPhone";
import SelectClub from "./SelectClub";
import InputOTP from "./InputOTP";
import { clubListState, certificateState, activeTabState } from "../recoil";
import { useRecoilValue, useRecoilState } from "recoil";
import Toast from "react-native-simple-toast";

const TAB_INPUT_PHONE = 0;
const TAB_SELECT_CLUB = 1;
const TAB_INPUT_OTP = 2;

const InformationPage = (props) => {
  const { style, intl } = props;

  //state
  const [isByPass, setIsByPass] = useState(false);
  let countByPass = 0;

  //recoil state
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const clubList = useRecoilValue(clubListState);
  const [certificate, setCertificate] = useRecoilState(certificateState);

  //effect
  useEffect(() => {
    if (clubList && clubList.length) {
      let tmpCertificate = { ...certificate };
      if (isByPass) tmpCertificate.is_bypass = 1;

      if (clubList.length == 1) {
        tmpCertificate.club_id = clubList[0].id;
        setActiveTab(TAB_INPUT_OTP);
      } else {
        setActiveTab(TAB_SELECT_CLUB);
      }
      setCertificate({ ...tmpCertificate });
    }
  }, [clubList]);

  //function - event
  const doByPass = () => {
    countByPass++;
    console.log("doByPass:::", countByPass, isByPass);
    if (countByPass >= 10) {
      Toast.show("sua di khang :))", Toast.SHORT);
      setIsByPass(true);
    }
  };

  //render
  const tabs = [
    <InputPhone style={styles.inputPhone} />,
    <SelectClub style={styles.selectClub} />,
    <InputOTP style={styles.inputOTP} />,
  ];

  const renderTabs = () => {
    return (
      <Tabs
        page={activeTab}
        locked
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, borderWidth: 0, marginTop: -2 }} />
        )}
      >
        {tabs.map((tab) => (
          <Tab heading="" style={{ backgroundColor: "transparent" }}>
            {tab}
          </Tab>
        ))}
      </Tabs>
    );
  };

  return (
    <View style={[style, styles.container]}>
      <TouchableOpacity style={styles.viewByPass} onPress={() => doByPass()} />
      {renderTabs()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputPhone: {
    flex: 1,
    margin: space.componentMargin,
    marginTop: 0,
  },
  selectClub: {
    flex: 1,
  },
  inputOTP: {
    flex: 1,
    margin: space.componentMargin,
    marginTop: 0,
  },
  viewByPass: {
    width: scale(200),
    height: scale(200),
    position: "absolute",
    top: scale(-230),
    left: 0,
    right: 0,
  },
});

export default injectIntl(InformationPage);
