import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRecoilValue } from "recoil";
import { certificateState } from "container/recoil/state/login";
import {
  scale,
  color,
  fontSize,
  defaultText,
} from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import {
  signInWithPhoneNumber,
  getIdToken,
} from "container/action/authenticate";
import { doLogin, loginSuccess } from "container/action/user";
import { showSpinner, hideSpinner } from "container/utils/router";

const InputOTP = (props) => {
  const { intl, style } = props;
  //state
  const [otp, setOTP] = useState(null);
  const [confirmOTP, setConfirmOTP] = useState(null);

  //recoil
  const certificate = useRecoilValue(certificateState);

  //function
  useEffect(() => {
    //in case bypass, force login
    if (certificate.is_bypass)
      doLogin({
        club_id: certificate.club_id,
        is_bypass: certificate.is_bypass,
        phone_number: certificate.phone,
      });
    // else do authenticate by firebase
    else {
      showSpinner();
      signInWithPhoneNumber(certificate.phone)
        .then((confirm) => {
          if (confirm) setConfirmOTP(confirm);
          hideSpinner();
        })
        .catch((err) => {
          console.error(err);
          hideSpinner();
        });
    }
  }, []);

  const activeUser = async () => {
    if (confirmOTP && otp) {
      confirmOTP
        .confirm(otp)
        .then((result) => {
          if (result && certificate) {
            getIdToken().then((token) => {
              console.log("activeUser::::", token);
              if (token) {
                let payload = {};
                if (certificate.phone) payload.phone_number = certificate.phone;
                if (certificate.club_id) payload.club_id = certificate.club_id;
                payload.firebase_token = token;
                doLogin(payload);
              }
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
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
        <Text
          style={{ ...defaultText, color: "#fff", fontSize: fontSize.size28 }}
        >
          {intl.formatMessage(Messages.sign_in)}
        </Text>
      </TouchableOpacity>

      <View style={styles.signUp}>
        <Text
          style={{
            ...defaultText,
            color: color.fontColor,
            fontSize: fontSize.size28,
            fontWeight: "bold",
          }}
        >
          {intl.formatMessage(Messages.new_here)}{" "}
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              ...defaultText,
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
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: scale(60),
    height: scale(100),
  },
  button: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
  },
  signUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(100),
  },
});

export default injectIntl(InputOTP);
