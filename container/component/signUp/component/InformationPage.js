import { Tabs, Tab, ScrollableTab } from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import InputItem from "container/component/ui/inputItem";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import update from "immutability-helper";
import ModalContext from "container/context/modal";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import Toast from "react-native-simple-toast";
import { loginSuccess } from "container/action/user";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { postRequest } from "container/utils/request";

import {
  scale,
  color,
  fontSize,
  space,
  shadow,
} from "container/variables/common";
import { formatCode } from "../../../utils/common";
import { showModal } from "../../../utils/router";
import { confirmCode, verifyPhoneNumber } from "../../../action/authenticate";

const DEFAULT_INFO = {
  club_name: null,
  code: null,
  phone: null,
  mem_name: null,
};

const VERIFY_TAB = 2;

const COUNT_DOWN_OTP = 15;
const DELAY_TIME_OUT = 1000;

const InformationPage = (props) => {
  //props
  const { intl } = props;
  //state
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [otp, setOTP] = useState(null);
  const [currTab, setCurrTab] = useState(0);
  const [countResend, setCountResend] = useState(COUNT_DOWN_OTP);

  //variables
  const verificationId = useRef(null);
  const countDownInterval = useRef(null);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //hooks -------------------------------------------------------------------------------------
  useEffect(() => {
    if (currTab == VERIFY_TAB) onVerifyPhone();
    return () => {
      if (countDownInterval.current) clearInterval(countDownInterval.current);
    };
  }, [currTab]);

  useEffect(() => {
    if (countResend <= 0) clearInterval(countDownInterval.current);
  }, [countResend]);

  //function ----------------------------------------------------------------------------------
  const onChangeInfo = (fieldName, value) => {
    if (fieldName == "club_name") {
      const transformCode = formatCode(value);
      console.log("onChangeInfo:::", transformCode);
      setInfo(
        update(info, {
          code: { $set: transformCode },
          club_name: { $set: value },
        })
      );
    } else {
      setInfo(update(info, { [fieldName]: { $set: value } }));
    }
  };

  const onNext = () => {
    if (currTab >= VERIFY_TAB - 1) {
      if (validateForm()) setCurrTab(VERIFY_TAB);
    } else {
      setCurrTab(currTab + 1);
    }
  };

  const onBack = () => {
    setCurrTab(currTab <= 0 ? 0 : currTab - 1);
  };

  const validateForm = () => {
    const dataIndex = Object.keys(info).findIndex(
      (key) => !info[key] || info[key] == ""
    );

    //if has not already filled all field
    if (dataIndex >= 0) {
      Toast.show(intl.formatMessage(Messages.pls_fill_required), Toast.LONG);
      return false;
    }
    return true;
  };

  const onVerifyPhone = () => {
    showSpinner();

    verifyPhoneNumber(info.phone)
      .then((id) => {
        if (id) verificationId.current = id;
        hideSpinner();
        doCountDown();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
        doCountDown();
        onFirebaseError(err);
      });
  };

  const activePhone = () => {
    if (otp) {
      showSpinner();
      confirmCode(verificationId.current, otp)
        .then((isConfirmed) => {
          if (isConfirmed) doSignUp();
          hideSpinner();
        })
        .catch((err) => {
          hideSpinner();
          onFirebaseError(err);
        });
    }
  };

  const doSignUp = () => {
    postRequest("auth/sign-up", info)
      .then((res) => {
        if (res && res.data) {
          loginSuccess(res.data);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const doCountDown = () => {
    countDownInterval.current = setInterval(() => {
      if (countResend > 0) setCountResend((curr) => curr - 1);
      else clearInterval(countDownInterval.current);
    }, DELAY_TIME_OUT);
  };

  const onFirebaseError = (err) => {
    //some magic from Duong with love
    const errStr = err.toString();
    const splitArr = errStr.split(/\[|\]/);
    const code =
      splitArr && splitArr.length && splitArr.length >= 2 ? splitArr[1] : null;

    const message = code
      ? intl.formatMessage(Messages[code])
      : err.message
      ? err.message
      : err;
    // console.error(err);
    console.log("doVerify::::error:::message", message);
    showModal({
      options: {
        content: message,
      },
      type: "error",
    });
  };

  //render ------------------------------------------------------------------------------------
  const renderHeading = () => {
    return (
      <Text style={styles.textTitle}>
        {intl.formatMessage(Messages.sign_up)}
      </Text>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationBox}>
        {TABS.map((tab, index) =>
          index > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={styles.line(currTab, index)} />
              <View style={styles.numberBox(currTab, index)}>
                <Text style={styles.textPagination(currTab, index)}>
                  {index + 1}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.numberBox(currTab, index)}>
              <Text style={styles.textPagination(currTab, index)}>
                {index + 1}
              </Text>
            </View>
          )
        )}
      </View>
    );
  };

  const renderSubmit = () => {
    const isVerify = currTab >= TABS.length - 1;

    return (
      <View style={styles.buttonBox}>
        <TouchableOpacity
          disabled={currTab <= 0}
          style={[
            styles.button,
            {
              borderTopLeftRadius: space.border * 2,
              borderBottomLeftRadius: space.border * 2,
              borderRightWidth: scale(2),
              borderColor: color.lightGrey,
            },
          ]}
          onPress={() => onBack()}
        >
          <Text
            style={[
              styles.textSubmit,
              currTab == 0 ? { color: color.lightGrey } : null,
            ]}
          >
            {intl.formatMessage(Messages.back)}
          </Text>
        </TouchableOpacity>
        {isVerify ? (
          <TouchableOpacity
            disabled={currTab <= 0}
            style={[
              styles.button,
              {
                borderTopRightRadius: space.border * 2,
                borderBottomRightRadius: space.border * 2,
              },
            ]}
            onPress={() => activePhone()}
          >
            <Text style={[styles.textSubmit, { color: color.success }]}>
              {intl.formatMessage(Messages.done)}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopRightRadius: space.border * 2,
                borderBottomRightRadius: space.border * 2,
              },
            ]}
            onPress={() => onNext()}
          >
            <Text style={[styles.textSubmit, { color: color.blue }]}>
              {intl.formatMessage(Messages.next)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderReSendBtn = () => {
    const isVerify = currTab >= TABS.length - 1;

    return isVerify ? (
      <TouchableOpacity
        style={[
          styles.resentButton,
          {
            borderColor: countResend <= 0 ? color.blue : color.text,
          },
        ]}
        disabled={countResend > 0}
        onPress={() => onVerifyPhone()}
      >
        <Text
          style={{
            fontSize: fontSize.size28,
            color: countResend <= 0 ? color.blue : color.hint,
          }}
        >
          {intl.formatMessage(Messages.resend_otp)}
        </Text>
        {countResend != 0 ? (
          <Text style={styles.textCountDown}>{countResend}</Text>
        ) : null}
      </TouchableOpacity>
    ) : null;
  };

  const renderClubInfo = () => {
    return (
      <React.Fragment>
        <InputItem
          style={styles.input}
          placeholder={intl.formatMessage(Messages.club_name)}
          onChangeText={(text) => onChangeInfo("club_name", text)}
          value={info.club_name}
        />

        <InputItem
          placeholder={intl.formatMessage(Messages.club_code)}
          onChangeText={(code) => onChangeInfo("code", code)}
          value={info.code}
        />
      </React.Fragment>
    );
  };

  const renderAdminInfo = () => {
    return (
      <React.Fragment>
        <InputItem
          style={styles.input}
          placeholder={intl.formatMessage(Messages.admin_name)}
          onChangeText={(text) => onChangeInfo("mem_name", text)}
          value={info.mem_name}
        />

        <InputItem
          placeholder={intl.formatMessage(Messages.phone)}
          onChangeText={(phone) => onChangeInfo("phone", phone)}
          value={info.phone}
          keyboardType="numeric"
        />
      </React.Fragment>
    );
  };

  const renderOTP = () => {
    return (
      <InputItem
        inputStyle={{ fontSize: fontSize.size36 }}
        style={styles.input}
        type="otp"
        textAlign="center"
        placeholder={intl.formatMessage(Messages.otp)}
        onChangeText={(code) => setOTP(code)}
        value={otp ? otp : undefined}
      />
    );
  };

  const TABS = [
    {
      heading: intl.formatMessage(Messages.club_information),
      render: renderClubInfo(),
    },
    {
      heading: intl.formatMessage(Messages.admin_information),
      render: renderAdminInfo(),
    },
    {
      heading: intl.formatMessage(Messages.verification),
      render: renderOTP(),
    },
  ];

  const renderTab = () => {
    return (
      <Tabs
        initialPage={0}
        page={currTab}
        locked
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, borderWidth: 0, marginTop: -2 }} />
        )}
      >
        {TABS.map((tab) => (
          <Tab heading="">
            <View style={styles.headingBox}>
              <Text style={styles.textHeading}>{tab.heading}</Text>
            </View>
            <View style={styles.bodyBox}>{tab.render}</View>
          </Tab>
        ))}
      </Tabs>
    );
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* {renderHeading()} */}
      {renderPagination()}
      {renderTab()}
      {renderSubmit()}
      {renderReSendBtn()}
    </KeyboardAwareScrollView>
  );
};

export default injectIntl(InformationPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: scale(40),
  },
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: space.componentMargin,
    marginVertical: space.componentMargin,
    borderRadius: space.border,
    backgroundColor: color.light,
    borderWidth: scale(1),
    borderColor: color.lightGreyPlus,
  },
  button: {
    flexDirection: "row",
    height: scale(80),
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  resentButton: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: scale(1),
    margin: space.componentMargin,
    marginTop: 0,
  },
  textCountDown: {
    position: "absolute",
    right: space.componentMargin,
  },
  textSubmit: {
    fontSize: fontSize.size30,
  },
  textTitle: {
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: space.componentMargin,
  },
  headingBox: {
    margin: space.componentMargin,
    marginBottom: 0,
    paddingVertical: space.itemMargin,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeading: {
    fontSize: fontSize.sizeContent,
    fontWeight: "bold",
  },
  bodyBox: {
    margin: space.componentMargin,
  },
  paginationBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: space.componentMargin,
    marginBottom: scale(60),
  },
  numberBox: (currTab, index) => ({
    width: scale(60),
    aspectRatio: 1,
    borderRadius: scale(30),
    backgroundColor: index <= currTab ? color.success : color.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  }),
  line: (currTab, index) => ({
    flex: 1,
    borderBottomWidth: scale(4),
    borderColor: index <= currTab ? color.success : color.lightGrey,
  }),
  textPagination: (currTab, index) => ({
    fontSize: fontSize.size32,
    color: "#fff",
  }),
});
