import React from "react";
import { injectIntl } from "react-intl";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  defaultText,
} from "container/variables/common";
import Messages from "container/translation/Message";

const SimpleDetail = (props) => {
  const {
    header,
    iconHeader,
    body,
    data,
    contentItems,
    renderMember,
    intl,
    onViewMembers,
    style,
  } = props;


  // render
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.title}>
          {iconHeader ? (
            <View style={styles.iconTitle}>{iconHeader}</View>
          ) : null}
          <Text style={styles.textTitle}>{data.title}</Text>
        </View>
        {data.description ? (
          <Text style={styles.description}>{data.description}</Text>
        ) : null}
      </View>
    );
  };

  const renderContentItem = (item) => {
    return (
      <View style={style.itemContent}>
        <View style={styles.leftItem}>
          <View style={styles.dot} />
          <Text style={styles.titleItem}>{item.title}</Text>
        </View>
        <Text style={styles.textItem}></Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View>
        {renderMember && data.member ? (
          <View style={style.itemContent}>
            <View style={styles.leftItem}>
              <View style={styles.dot} />
              <Text style={styles.titleItem}>
                {intl.formatMessage(Messages.member)}
              </Text>
            </View>
            {data.member.length ? (
              <TouchableOpacity
                onPress={() => onViewMembers(data.member)}
                style={styles.memberList}
              ></TouchableOpacity>
            ) : (
              <Text style={{ ...defaultText }}>
                {intl.formatMessage(Messages.have_no_member)}
              </Text>
            )}
          </View>
        ) : null}
        {contentItems && contentItems.length
          ? contentItems.map((item) => renderContentItem(item))
          : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        {header ? header(data) : renderHeader()}
        {body ? body(data) : renderBody()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    padding: space.bgPadding,
    ...shadow,
  },
  header: {
    backgroundColor: "#fff",
    borderColor: color.border,
    borderRadius: space.border,
    borderBottomWidth: scale(2),
    paddingBottom: scale(50),
    marginBottom: space.componentMargin,
    ...shadow,
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  iconTitle: {
    borderRadius: space.border,
    height: "100%",
    aspectRatio: 1,
    position: "absolute",
    left: 0,
  },
  textTitle: {
    ...defaultText,
  },
  description: {
    ...defaultText,
  },
  dot: {
    width: scale(20),
    height: scale(20),
    backgroundColor: color.warning,
    borderRadius: scale(15),
    marginRight: space.componentMargin,
  },
  memberList: {
    flexDirection: "row",
  },
  textItem: {
    ...defaultText,
    fontWeight: "bold",
  },
  titleItem: {
    ...defaultText,
  },
  leftItem: {
    marginRight: scale(40),
  },
  itemContent: {
    marginBottom: space.componentMargin,
  },
});

export default injectIntl(SimpleDetail);
