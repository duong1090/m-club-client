import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";
import { Icon } from "native-base";

const HeaderInfo = (props) => {
  const { style, onRefresh } = props;

  //organization
  const { member } = global.organization || {};
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Avatar size={scale(100)} data={member} />
          <View>
            {member && member.name ? (
              <Text style={styles.name}>{member.name}</Text>
            ) : null}
            {member && member.position && member.position.name ? (
              <Text style={styles.position}>{member.position.name}</Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log("HeaderInfo:::", onRefresh);

            onRefresh();
          }}
          style={styles.iconBox}
        >
          <Icon
            name="refresh"
            type="MaterialIcons"
            style={styles.iconRefresh}
          />
        </TouchableOpacity>
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
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  name: {
    marginLeft: scale(20),

    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
  position: {
    fontSize: fontSize.size28,
    marginLeft: scale(20),
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
    fontSize: fontSize.size24,
    color: color.text,
    marginLeft: scale(5),
  },
  backIcon: {
    fontSize: scale(20),
    color: color.text,
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: -space.componentMargin,
    paddingRight: space.itemMargin,
    paddingLeft: scale(10),
    paddingVertical: space.itemMargin,
    borderTopLeftRadius: space.border,
    borderBottomLeftRadius: space.border,
    backgroundColor: color.backgroundColor,
  },
  iconRefresh: {
    fontSize: scale(50),
    color: color.grey,
  },
});

export default HeaderInfo;
