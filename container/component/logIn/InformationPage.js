import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { View, Text, StyleSheet } from "react-native";
import { Tabs, Tab, ScrollableTab } from "native-base";
import Messages from "container/translation/Message";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
} from "container/variables/common";
import InputPhone from "./InputPhone";
import SelectClub from "./SelectClub";
import InputOTP from "./InputOTP";
import {
  clubListState,
  certificateState,
  activeTabState,
} from "container/recoil/state/login";
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
        initialPage={0}
        page={activeTab}
        locked
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, borderWidth: 0 }} />
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
      <Text onPress={() => doByPass()} style={styles.welcome}>
        {intl.formatMessage(Messages.welcome_to_mclub)}
      </Text>
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
  },
  welcome: {
    ...defaultText,
    fontSize: fontSize.size40,
    color: color.fontColor,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: space.componentMargin,
    alignSelf: "center",
  },
  selectClub: {
    flex: 1,
  },
  inputOTP: {
    flex: 1,
  },
});

export default injectIntl(InformationPage);
