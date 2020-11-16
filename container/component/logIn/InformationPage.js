import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { View, Text, StyleSheet } from "react-native";
import Messages from "container/translation/Message";
import { scale, color, fontSize } from "container/variables/common";
import InputPhone from "./InputPhone";
import SelectClub from "./SelectClub";
import InputOTP from "./InputOTP";
import { clubListState, certificateState } from "container/recoil/state/login";
import { useRecoilValue, useRecoilState } from "recoil";

const TAB_INPUT_PHONE = 0;
const TAB_SELECT_CLUB = 1;
const TAB_INPUT_OTP = 2;

const InformationPage = (props) => {
  const { style, intl } = props;

  //state
  const [activeTab, setActiveTab] = useState(0);

  //recoil state
  const clubList = useRecoilValue(clubListState);
  const [certificate, setCertificate] = useRecoilState(certificateState);

  useEffect(() => {
    console.log("Login:::useEffect:::", clubList);
    if (clubList && clubList.length) {
      if (clubList.length == 1) {
        setActiveTab(TAB_INPUT_OTP);
        setCertificate({ ...certificate, club_id: clubList[0].id });
      } else {
        setActiveTab(TAB_SELECT_CLUB);
      }
    }
  }, [clubList]);

  const tabs = [
    <InputPhone style={styles.inputPhone} />,
    <SelectClub style={styles.selectClub} />,
    <InputOTP style={styles.inputOTP} />,
  ];

  return (
    <View style={[style, styles.container]}>
      <Text style={styles.welcome}>
        {intl.formatMessage(Messages.welcome_to_mclub)}
      </Text>
      {/* {tabs[activeTab]} */}
      <InputOTP style={styles.inputOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputPhone: {
    width: "100%",
  },
  welcome: {
    fontSize: fontSize.size50,
    color: color.fontColor,
    fontWeight: "bold",
    marginBottom: scale(30),
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
