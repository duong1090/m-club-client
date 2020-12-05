import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import InputItem from "container/component/ui/inputItem";
import { injectIntl } from "react-intl";
import {
  scale,
  color,
  fontSize,
  defaultText,
} from "container/variables/common";
import Messages from "container/translation/Message";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";

const DEFAULT_INFORMATION = {
  name: null,
  phone: null,
  address: null,
  email: null,
  sex: null,
  birthday: null,
  department: null,
  position: null,
};

const MemberRecord = (props) => {
  const { intl } = props;
  const [info, setInfo] = useState(DEFAULT_INFORMATION);
  const {
    name,
    phone,
    address,
    email,
    sex,
    birthday,
    department,
    position,
  } = info;

  const createMember = () => {
    let params = {};
    if (name) params.name = name;
    if (phone) params.phone = phone;
    if (address) params.address = address;
    if (email) params.email = email;
    if (sex) params.sex = sex;
    if (birthday) params.birthday = birthday;
    if (department) params.department = department;
    if (position) params.position = position;

    postRequest(Config.API_URL.concat("member/create"), params);
  };

  return (
    <View>
      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.name)}
        onChangeText={(text) => setInfo({ ...info, name: text })}
        value={name ? name : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.phone)}
        onChangeText={(text) => setInfo({ ...info, phone: text })}
        value={phone ? phone : null}
      />

      <InputItem
        style={styles.input}
        type="button"
        label="Name"
        required
        onPress={() => {}}
        placeholder={intl.formatMessage(Messages.address)}
        value={address ? address : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.email)}
        onChangeText={(text) => setInfo({ ...info, email: text })}
        value={email ? email : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.sex)}
        onChangeText={(text) => setInfo({ ...info, sex: text })}
        value={sex ? sex : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.birthday)}
        onChangeText={(text) => setInfo({ ...info, birthday: text })}
        value={birthday ? birthday : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.department)}
        onChangeText={(text) => setInfo({ ...info, department: text })}
        value={department ? department : null}
      />

      <InputItem
        style={styles.input}
        placeholder={intl.formatMessage(Messages.position)}
        onChangeText={(text) => setInfo({ ...info, position: text })}
        value={position ? position : null}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.background }]}
        onPress={() => createMember()}
      >
        <Text
          style={{ color: "#fff", fontSize: fontSize.size28, ...defaultText }}
        >
          {intl.formatMessage(Messages.create)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: scale(60),
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

export default injectIntl(MemberRecord);
