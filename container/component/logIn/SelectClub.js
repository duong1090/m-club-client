import React, { useState } from "react";
import { injectIntl } from "react-intl";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Icon } from "native-base";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import Messages from "container/translation/Message";

const SelectClub = (props) => {
  const { intl, style } = props;
  const [clubList, setClubList] = useState([
    { title: "English Speaking Club", code: "ESC_HCMUTE_01", selected: true },
    { title: "English Speaking Club", code: "ESC_HCMUTE_01", selected: false },
    { title: "English Speaking Club", code: "ESC_HCMUTE_01", selected: false },
    { title: "English Speaking Club", code: "ESC_HCMUTE_01", selected: false },
    { title: "English Speaking Club", code: "ESC_HCMUTE_01", selected: false },
  ]);

  const clubItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={[
          styles.item,
          {
            borderColor: item.selected ? color.background : color.disable,
          },
        ]}
      >
        <Text
          style={[
            styles.titleItem,
            { color: item.selected ? color.background : color.disable },
          ]}
        >
          {item.title}
        </Text>
        <View style={styles.descriptionItem}>
          <Text
            style={[
              styles.codeItem,
              { color: item.selected ? color.background : color.disable },
            ]}
          >
            {item.code}
          </Text>
          <View
            style={[
              styles.checkIcon,
              { backgroundColor: item.selected ? color.background : "#fff" },
            ]}
          >
            <Icon
              name="checkmark"
              style={{ fontSize: scale(35), color: "#fff" }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={style}>
      <Text style={styles.title}>
        {intl.formatMessage(Messages.select_club)}
      </Text>

      <FlatList
        style={styles.list}
        data={clubList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => clubItem(item)}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.background }]}
        onPress={() => {}}
      >
        <Text
          style={{ ...defaultText, color: "#fff", fontSize: fontSize.size28 }}
        >
          {intl.formatMessage(Messages.next)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(60),
  },

  title: {
    ...defaultText,
    marginBottom: space.componentMargin,
    alignSelf: "center",
    fontSize: fontSize.size36,
    color: color.background,
    fontWeight: "bold",
  },

  list: {
    height: "58%",
  },

  item: {
    backgroundColor: "#fff",
    padding: space.bgPadding,
    borderRadius: scale(20),
    marginBottom: space.componentMargin,
    borderWidth: scale(2),
    ...shadow,
  },

  descriptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleItem: {
    ...defaultText,
    marginBottom: space.componentMargin,
    fontSize: fontSize.size32,
    fontWeight: "bold",
  },

  codeItem: {
    ...defaultText,
    fontSize: fontSize.size28,
  },

  checkIcon: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: scale(2),
    borderColor: color.background,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default injectIntl(SelectClub);
