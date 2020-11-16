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
import { scale, color, fontSize } from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import { signInWithPhoneNumber } from "container/action/authenticate";
import { doLogin, loginSuccess } from "container/action/user";
import screens from "container/constant/screen";
import { gotoRoute } from "container/utils/router";

const InputOTP = (props) => {
  const { intl, style } = props;
  //state
  const [otp, setOTP] = useState(null);
  const [confirmOTP, setConfirmOTP] = useState(null);

  //recoil
  const certificate = useRecoilValue(certificateState);

  //function
  useEffect(() => {
    signInWithPhoneNumber(certificate.phone)
      .then((confirm) => {
        if (confirm) setConfirmOTP(confirm);
      })
      .catch((err) => console.error(err));
  }, []);

  const activeUser = () => {
    if (confirmOTP) {
      confirmOTP.confirm(otp).then((user) => {
        if (user && certificate) {
          const firebase_token = user.getIdToken();
          let payload = {};
          if (certificate.phone) payload.phone = certificate.phone;
          if (certificate.club_id) payload.club_id = certificate.club_id;
          if (firebase_token) payload.firebase_token = firebase_token;
          doLogin(payload);
        }
      });
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
        <Text style={{ color: "#fff", fontSize: fontSize.size28 }}>
          {intl.formatMessage(Messages.sign_in)}
        </Text>
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
        <TouchableOpacity onPress={() => {}}>
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
