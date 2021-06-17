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

  const gotoView = () => {
    gotoRoute(screens.USER_INFO, {
      mode: "list",
      updateCallback: updateAvatar,
    });
  };
  const gotoSetting = () => {
    gotoRoute(screens.SETTING);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.settingBtn} onPress={() => gotoSetting()}>
        <Text style={styles.setting}>
          {intl.formatMessage(Messages.setting)}
        </Text>
        <Icon name="settings-sharp" style={styles.settingIcon} />
      </TouchableOpacity>

      <View style={styles.person}>
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
        <TouchableOpacity style={styles.avatar} onPress={() => gotoEdit()}>
          <Avatar size={scale(150)} data={avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    position: "absolute",
    left: scale(30),
    top: 0,
  },
  info: {
    backgroundColor: "#fff",
    flex: 1,
    height: scale(120),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: scale(75),
    borderBottomWidth: scale(1),
    borderColor: color.grey,
  },
  memberInfo: {
    flex: 1,
    margin: space.bgPadding / 2,
    marginLeft: space.bgPadding * 2 + scale(150),
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
    fontWeight: "bold",
  },
  position: {
    ...defaultText,
    fontSize: fontSize.size28,
    color: "#fff",
  },
  editIcon: {
    fontSize: fontSize.size24,
  },
  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: space.bgPadding,
    marginTop: space.itemMargin,
  },
  setting: {
    ...defaultText,
    color: "#fff",
    marginRight: scale(10),
  },
  settingIcon: {
    fontSize: fontSize.size24,
    color: "#fff",
  },
});

export default injectIntl(Information);
