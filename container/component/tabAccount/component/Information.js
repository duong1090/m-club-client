import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";
import { Icon } from "native-base";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { gotoRoute } from "container/utils/router";
import { screens } from "container/constant/screen";

const Information = (props) => {
  //props
  const { style, intl } = props;
  const { member } = global.organization || {};
  const [avatar, setAvatar] = useState(member ? member : {});

  const updateAvatar = () => {
    console.log("updateAvatar:::");
    setAvatar(JSON.parse(JSON.stringify(member)));
  };

  const gotoEdit = () => {
    gotoRoute(screens.USER_INFO, { updateCallback: updateAvatar });
  };

  const gotoSetting = () => {
    gotoRoute(screens.SETTING);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.person}>
        <Avatar style={styles.avatar} size={scale(150)} data={avatar} />
        <View style={styles.info}>
          <View style={styles.memberInfo}>
            {member && member.name ? (
              <Text style={styles.name}>{member.name}</Text>
            ) : null}
            {member && member.position && member.position.name ? (
              <Text style={styles.position}>{member.position.name}</Text>
            ) : null}
          </View>
          <TouchableOpacity style={styles.editInfo} onPress={() => gotoEdit()}>
            <Icon type="FontAwesome5" name="pen" style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.settingBtn} onPress={() => gotoSetting()}>
        <Text style={styles.setting}>
          {intl.formatMessage(Messages.setting)}
        </Text>
        <Icon name="settings-sharp" style={styles.settingIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding / 2,
    backgroundColor: "#fff",
    ...shadow,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    elevation: 11,
  },
  info: {
    marginLeft: -space.bgPadding,
    backgroundColor: color.primary,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopRightRadius: space.border,
    borderBottomRightRadius: space.border,

  },
  memberInfo: {
    flex: 1,
    margin: space.bgPadding / 2,
    marginLeft: space.bgPadding * 2,
    marginRight: space.bgPadding,
  },
  editInfo: {
    height: scale(80),
    width: scale(80),
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    ...defaultText,
    fontSize: fontSize.size36,
    color: "#fff",
    fontWeight: "bold",
  },
  position: {
    ...defaultText,
    fontSize: fontSize.size28,
    color: "#fff",
  },
  editIcon: {
    fontSize: fontSize.size24,
    color: "#fff",
  },
  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  setting: {
    ...defaultText,
    color: color.primary,
    marginRight: scale(10),
  },
  settingIcon: {
    fontSize: fontSize.size24,
    color: color.primary,
  },
});

export default injectIntl(Information);
