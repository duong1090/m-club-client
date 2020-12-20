import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { View, Text, StyleSheet } from "react-native";
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
import { clubListState, certificateState } from "container/recoil/state/login";
import { useRecoilValue, useRecoilState } from "recoil";
import Toast from "react-native-simple-toast";

const TAB_INPUT_PHONE = 0;
const TAB_SELECT_CLUB = 1;
const TAB_INPUT_OTP = 2;

const InformationPage = (props) => {
  const { style, intl } = props;

  //state
  const [activeTab, setActiveTab] = useState(0);
  const [isByPass, setIsByPass] = useState(false);
  let countByPass = 0;

  //recoil state
  const clubList = useRecoilValue(clubListState);
  const [certificate, setCertificate] = useRecoilState(certificateState);

  //effect
  useEffect(() => {
    if (clubList && clubList.length) {
      if (clubList.length == 1) {
        let tmpCertificate = { ...certificate, club_id: clubList[0].id };
        if (isByPass) tmpCertificate.is_bypass = 1;
        console.log("Login:::useEffect:::", isByPass, tmpCertificate);
        setCertificate({ ...tmpCertificate });
        setActiveTab(TAB_INPUT_OTP);
      } else {
        setActiveTab(TAB_SELECT_CLUB);
      }
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

  return (
    <View style={[style, styles.container]}>
      <Text onPress={() => doByPass()} style={styles.welcome}>
        {intl.formatMessage(Messages.welcome_to_mclub)}
      </Text>
      {tabs[activeTab]}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputPhone: {
    width: "100%",
  },
  welcome: {
    ...defaultText,
    fontSize: fontSize.size50,
    color: color.fontColor,
    fontWeight: "bold",
    marginBottom: space.componentMargin,
    alignSelf: "center",
  },
  selectClub: {
    width: "100%",
  },
  inputOTP: {
    width: "100%",
  },
});

export default injectIntl(InformationPage);
