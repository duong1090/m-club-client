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
import PrivilegeAction from "container/component/ui/privilegeAction";

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
    privilege,
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
    console.log("renderContentItem:::", item);
    return (
      <View style={styles.itemContent}>
        <View style={styles.leftItem}>
          <View style={styles.dot} />
          <Text style={styles.titleItem}>{item.title}</Text>
        </View>
        <Text style={styles.textItem}>{item.value}</Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View>
        {renderMember && data.member ? (
          <View style={styles.itemContent}>
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
            style={[styles.backButton, { backgroundColor: color.primary }]}
          >
            <Icon name="caret-back" style={styles.actionIcon} />
            <Text style={styles.actionText}>{backButton.title}</Text>
          </TouchableOpacity>
        ) : null}
        {updateButton ? (
          <PrivilegeAction privilegeKey={privilege.update}>
            <TouchableOpacity
              onPress={() => updateButton.onPress()}
              style={[styles.backButton, { backgroundColor: color.success }]}
            >
              <Icon name="edit" type="Entypo" style={styles.actionIcon} />
              <Text style={styles.actionText}>{updateButton.title}</Text>
            </TouchableOpacity>
          </PrivilegeAction>
        ) : null}
      </View>
      <View style={styles.card}>
        {header ? header(data) : renderHeader()}
        <View style={styles.content}>
          {body ? body(data) : renderBody()}

          {onDelete ? (
            <PrivilegeAction privilegeKey={privilege.delete}>
              <TouchableOpacity style={styles.deleteBox} onPress={onDelete}>
                <Text style={styles.titleSymbol}>
                  {intl.formatMessage(Messages.delete)}
                </Text>
              </TouchableOpacity>
            </PrivilegeAction>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.backgroundColor,
    height: "100%",
  },
  content: {
    padding: space.bgPadding,
  },
  card: {
    margin: space.componentMargin,
    backgroundColor: "#fff",
    borderRadius: space.border,
    ...shadow,
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: color.background,
    marginBottom: space.componentMargin,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: space.bgPadding,
    paddingVertical: space.bgPadding / 1.5,
  },
  iconTitle: {
    borderRadius: space.border,
    height: scale(90),
    width: scale(90),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: space.componentMargin,
  },
  textTitle: {
    ...defaultText,
    color: "#fff",
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
    fontSize: fontSize.sizeContent,
  },
  titleItem: {
    ...defaultText,
    fontSize: fontSize.sizeContent,
    fontWeight: "bold",
  },
  leftItem: {
    marginRight: scale(40),
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    marginBottom: space.componentMargin,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: scale(10),
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: space.itemMargin,
    borderColor: color.text,
    paddingHorizontal: scale(20),
    paddingVertical: scale(5),
    borderRadius: space.border,
    ...shadow,
  },
  actionText: {
    ...defaultText,
    fontSize: fontSize.size28,
    color: "#fff",
    marginLeft: scale(5),
  },
  actionIcon: {
    fontSize: scale(25),
    color: "#fff",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: space.componentMargin,
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
