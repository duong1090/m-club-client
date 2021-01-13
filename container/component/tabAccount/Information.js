import React from "react";
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

  const gotoEdit = () => {
    gotoRoute(screens.USER_INFO);
  };

  const gotoSetting = () => {
    gotoRoute(screens.SETTING);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.person}>
        <Avatar style={styles.avatar} size={scale(150)} data={member} />
        <View style={styles.info}>
          <View>
            {member && member.name ? (
              <Text style={styles.name}>{member.name}</Text>
            ) : null}
            {member && member.position && member.position.name ? (
              <Text style={styles.position}>{member.position.name}</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => gotoEdit()}>
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
    elevation: 4,
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
    padding: space.bgPadding / 2,
    paddingLeft: space.bgPadding * 2,
    paddingRight: space.bgPadding,
    ...shadow,
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
