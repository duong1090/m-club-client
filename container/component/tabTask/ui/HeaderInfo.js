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

const HeaderInfo = (props) => {
  const { style, backButton } = props;

  //organization
  const { member } = global.organization;
  return (
    <View style={[styles.container, style]}>
      {backButton ? (
        <TouchableOpacity
          onPress={() => backButton.onPress()}
          style={styles.backButton}
        >
          <Icon name="caret-back" style={styles.backIcon} />
          <Text style={styles.backText}>{backButton.title}</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View style={styles.content}>
        <View style={styles.info}>
          {member && member.name ? (
            <Text style={styles.name}>{member.name}</Text>
          ) : null}
          {member && member.position && member.position.name ? (
            <Text style={styles.position}>{member.position.name}</Text>
          ) : null}
        </View>
        <Avatar size={scale(100)} data={member} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: scale(20),
    alignItems: "center",
    justifyContent: "space-between",
    ...shadow,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    marginRight: scale(20),
    alignItems: "flex-end",
  },
  name: {
    ...defaultText,
    fontSize: fontSize.size36,
    fontWeight: "bold",
  },
  position: {
    ...defaultText,
    fontSize: fontSize.sizeBigContent,
    fontStyle: "italic",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: space.itemMargin,
    borderColor: color.text,
    backgroundColor: color.lightGrey,
    paddingHorizontal: scale(20),
    paddingVertical: scale(5),
    borderRadius: space.border,
  },
  backText: {
    ...defaultText,
    fontSize: fontSize.size24,
    color: color.text,
    marginLeft: scale(5),
  },
  backIcon: {
    fontSize: scale(20),
    color: color.text,
  },
});

export default HeaderInfo;
