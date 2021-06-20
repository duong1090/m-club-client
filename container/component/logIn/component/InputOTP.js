import React, { useState, useEffect, useContext } from "react";
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
import {
  scale,
  space,
  color,
  fontSize,
  
} from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import ModalContext from 'container/context/modal';
import {
  signInWithPhoneNumber,
  getIdToken,
} from "container/action/authenticate";
import { doLogin } from "container/action/user";


const InputOTP = (props) => {
  const { intl, style } = props;
  //state
  const [otp, setOTP] = useState(null);
  const [confirmOTP, setConfirmOTP] = useState(null);

  //recoil
  const certificate = useRecoilValue(certificateState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //function
  useEffect(() => {
    console.log("didUpdate::::", certificate);

    //in case bypass, force login
    if (certificate.is_bypass) {
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
    }
    //do authenticate by firebase
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
  }, [certificate]);

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
          style={{  color: "#fff", fontSize: fontSize.size28 }}
        >
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
    borderRadius: space.border,
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
