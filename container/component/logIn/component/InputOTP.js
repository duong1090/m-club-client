import React, { useState, useEffect, useContext, useRef } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRecoilValue } from "recoil";
import { certificateState } from "../recoil";
import { scale, space, color, fontSize } from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import ModalContext from "container/context/modal";
import { doLogin } from "container/action/user";
import { gotoRoute, showModal } from "../../../utils/router";
import {
  confirmCode,
  verifyPhoneNumber,
  getIdToken,
} from "../../../action/authenticate";
import { screens } from "../../../constant/screen";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";

const COUNT_DOWN_OTP = 15;
const DELAY_TIME_OUT = 1000;

const InputOTP = (props) => {
  const { intl, style } = props;
  //state
  const [otp, setOTP] = useState(null);
  const [countResend, setCountResend] = useState(COUNT_DOWN_OTP);

  //variables
  const verificationId = useRef(null);
  const countDownInterval = useRef(null);

  //recoil
  const certificate = useRecoilValue(certificateState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  useEffect(() => {
    console.log("didUpdate::::", certificate);
    //in case bypass, force login
    if (certificate.is_bypass) doByPass();
    //do authenticate by firebase
    else doVerify();

    return () => {
      if (countDownInterval.current) clearInterval(countDownInterval.current);
    };
  }, [certificate]);

  useEffect(() => {
    if (countResend <= 0) clearInterval(countDownInterval.current);
  }, [countResend]);

  //function ------------------------------------------------------------------------------------
  const gotoSignUp = () => {
    gotoRoute(screens.SIGNUP);
  };

  const doByPass = () => {
    showSpinner();
    doLogin({
      club_id: certificate.club_id,
      is_bypass: certificate.is_bypass,
      phone_number: certificate.phone,
    })
      .then((res) => {
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const doVerify = () => {
    showSpinner();

    verifyPhoneNumber(certificate.phone)
      .then((id) => {
        if (id) verificationId.current = id;
        hideSpinner();

        //do count down resend OTP
        doCountDown();
      })
      .catch((err) => {
        hideSpinner();
        onFirebaseError(err);
        //do count down resend OTP
        doCountDown();
      });
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

  const doCountDown = () => {
    countDownInterval.current = setInterval(() => {
      if (countResend > 0) setCountResend((curr) => curr - 1);
      else clearInterval(countDownInterval.current);
    }, DELAY_TIME_OUT);
  };

  const activeUser = () => {
    if (otp) {
      showSpinner();
      confirmCode(verificationId.current, otp)
        .then((isConfirmed) => {
          if (isConfirmed && certificate)
            getIdToken()
              .then((token) => {
                if (token != null) {
                  let payload = {};
                  if (certificate.phone)
                    payload.phone_number = certificate.phone;
                  if (certificate.club_id)
                    payload.club_id = certificate.club_id;
                  payload.firebase_token = token;
                  doLogin(payload)
                    .then((res) => {})
                    .catch((err) => {
                      console.log("activeUser loi ne ba:::", err);
                    });
                }
                hideSpinner();
              })
              .catch((err) => {
                hideSpinner();

                onFirebaseError(err);
              });
        })
        .catch((err) => {
          hideSpinner();
          onFirebaseError(err);
        });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <Animated.View style={style}>
        <InputItem
          inputStyle={{ fontSize: fontSize.size36 }}
          style={styles.input}
          type="otp"
          textAlign="center"
          placeholder={intl.formatMessage(Messages.otp)}
          onChangeText={(code) => setOTP(code)}
          value={otp ? otp : undefined}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.background }]}
          onPress={() => activeUser()}
        >
          <Text style={{ color: "#fff", fontSize: fontSize.size28 }}>
            {intl.formatMessage(Messages.sign_in)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              borderStyle: "dashed",
              borderWidth: scale(1),
              borderColor: countResend <= 0 ? color.blue : color.text,
              marginTop: space.componentMargin,
            },
          ]}
          disabled={countResend > 0}
          onPress={() => doVerify()}
        >
          <Text
            style={{
              fontSize: fontSize.size28,
              color: countResend <= 0 ? color.blue : color.hint,
            }}
          >
            {intl.formatMessage(Messages.resend_otp)}
          </Text>
          {countResend > 0 ? (
            <Text style={styles.textCountDown}>{countResend}</Text>
          ) : null}
        </TouchableOpacity>
        <View style={styles.signUp}>
          <Text
            style={{
              color: color.fontColor,
              fontSize: fontSize.size28,
              fontWeight: "bold",
            }}
          >
            {intl.formatMessage(Messages.new_here)}{" "}
          </Text>
          <TouchableOpacity onPress={() => gotoSignUp()}>
            <Text
              style={{
                color: color.background,
                fontSize: fontSize.size28,
                fontWeight: "bold",
              }}
            >
              {intl.formatMessage(Messages.sign_up_now)}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: scale(30),
    marginBottom: scale(60),
    height: scale(100),
  },
  button: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
  },
  signUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(100),
  },
  textCountDown: {
    position: "absolute",
    right: space.componentMargin,
  },
});

export default injectIntl(InputOTP);
