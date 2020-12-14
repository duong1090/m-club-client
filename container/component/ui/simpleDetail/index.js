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
import { Icon } from "native-base";
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
    backButton,
    updateButton,
    onDelete,
  } = props;

  // render
  const renderHeader = () => {
    console.log("renderHeader:::", data);

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
      <View style={styles.actionBox}>
        {backButton ? (
          <TouchableOpacity
            onPress={() => backButton.onPress()}
            style={styles.backButton}
          >
            <Icon name="caret-back" style={styles.actionIcon} />
            <Text style={styles.actionText}>{backButton.title}</Text>
          </TouchableOpacity>
        ) : null}
        {updateButton ? (
          <TouchableOpacity
            onPress={() => updateButton.onPress()}
            style={styles.backButton}
          >
            <Icon
              name="edit"
              type="Entypo"
              style={[
                styles.actionIcon,
                { color: color.action, marginRight: scale(10) },
              ]}
            />
            <Text style={[styles.actionText, { color: color.action }]}>
              {updateButton.title}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.card}>
        {header ? header(data) : renderHeader()}
        {body ? body(data) : renderBody()}

        <TouchableOpacity style={styles.deleteBox} onPress={onDelete}>
          <Text style={styles.titleSymbol}>
            {intl.formatMessage(Messages.delete)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
    backgroundColor: color.backgroundColor,
    height: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    padding: space.bgPadding,
    ...shadow,
  },
  header: {
    backgroundColor: "#fff",
    paddingBottom: scale(50),
    marginBottom: space.componentMargin,
    borderColor: color.border,
    borderBottomWidth: scale(2),
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: space.border,
    alignItems: "center",
    padding: space.bgPadding,
    ...shadow,
  },
  iconTitle: {
    borderRadius: space.border,
    height: scale(90),
    width: scale(90),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.background,
    left: 0,
    ...shadow,
  },
  textTitle: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
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
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: space.componentMargin,
  },
  actionText: {
    ...defaultText,
    fontSize: fontSize.size32,
    color: color.hint,
    fontWeight: "bold",
  },
  actionIcon: {
    fontSize: scale(40),
    color: color.hint,
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteBox: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    backgroundColor: color.danger,
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    ...shadow,
  },
  titleSymbol: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.sizeBigContent,
    fontWeight: "bold",
  },
});

export default injectIntl(SimpleDetail);
