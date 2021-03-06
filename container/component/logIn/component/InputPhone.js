import React, { useContext, useState } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from "react-native";
import { useSetRecoilState } from "recoil";
import { scale, color, space, fontSize } from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import { clubListState, certificateState } from "../recoil";
import { gotoRoute } from "container/utils/router";
import { screens } from "container/constant/screen";
import ModalContext from "container/context/modal";
import { preValidateLogin } from "container/action/user";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";

const InputPhone = (props) => {
  const { intl, style } = props;
  const [phone, setPhone] = useState(null);
  const setClubList = useSetRecoilState(clubListState);
  const setCertificate = useSetRecoilState(certificateState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  const checkLogin = () => {
    setCertificate({ phone });
    let payload = {
      phone,
    };

    Keyboard.dismiss();

    showSpinner();
    preValidateLogin(payload)
      .then((clubList) => {
        if (clubList && clubList.length) setClubList(clubList);
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const gotoSignUp = () => {
    gotoRoute(screens.SIGNUP);
  };

  return (
    <KeyboardAwareScrollView>
      <Animated.View style={style}>
        <InputItem
          style={styles.input}
          keyboardType="numeric"
          placeholder={intl.formatMessage(Messages.phone)}
          onChangeText={(text) => setPhone(text)}
          value={phone ? phone : null}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.background }]}
          onPress={() => checkLogin()}
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

export default injectIntl(InputPhone);
