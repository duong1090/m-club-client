import React, { useState } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSetRecoilState } from "recoil";
import {
  scale,
  color,
  fontSize,
  defaultText,
} from "container/variables/common";
import Messages from "container/translation/Message";
import InputItem from "container/component/ui/inputItem";
import { preValidateLogin } from "container/action/user";
import { clubListState, certificateState } from "container/recoil/state/login";
import { gotoRoute } from "container/utils/router";
import { screens } from "container/constant/screen";
import { showSpinner, hideSpinner } from "container/utils/router";

const InputPhone = (props) => {
  const { intl, style } = props;
  const [phone, setPhone] = useState(null);
  const setClubList = useSetRecoilState(clubListState);
  const setCertificate = useSetRecoilState(certificateState);

  const checkLogin = () => {
    setCertificate({ phone });
    let payload = {
      phone,
    };

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
        <TouchableOpacity onPress={() => gotoSignUp()}>
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

export default injectIntl(InputPhone);
