import React, { useContext } from "react";
import { injectIntl } from "react-intl";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import { Icon } from "native-base";
import Messages from "container/translation/Message";
import PrivilegeAction from "container/component/ui/privilegeAction";
import ModalContext from "../../../context/modal";

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

  const { showConfirmModal } = useContext(ModalContext);

  const confirmDelete = () => {
    const options = {
      onOk: () => onDelete(),
      content: intl.formatMessage(Messages.are_you_sure_to_delete),
    };

    showConfirmModal(options);
  };

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
              <Text>{intl.formatMessage(Messages.have_no_member)}</Text>
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
          <PrivilegeAction privilegeKey={privilege.update}>
            <TouchableOpacity
              onPress={() => updateButton.onPress()}
              style={styles.backButton}
            >
              <Icon
                name="edit"
                type="Entypo"
                style={[styles.actionIcon, { marginRight: scale(5) }]}
              />
              <Text style={styles.actionText}>{updateButton.title}</Text>
            </TouchableOpacity>
          </PrivilegeAction>
        ) : null}
      </View>
      <View style={styles.card}>
        {header ? header(data) : renderHeader()}
        <ScrollView style={styles.content}>
          {body ? body(data) : renderBody()}

          {onDelete ? (
            <PrivilegeAction privilegeKey={privilege.delete}>
              <TouchableOpacity
                style={styles.deleteBox}
                onPress={() => confirmDelete()}
              >
                <Text style={styles.titleSymbol}>
                  {intl.formatMessage(Messages.delete)}
                </Text>
              </TouchableOpacity>
            </PrivilegeAction>
          ) : null}
        </ScrollView>
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
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: color.backgroundColor,
    marginBottom: space.componentMargin,
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
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
  },
  description: {},
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
    fontSize: fontSize.sizeContent,
  },
  titleItem: {
    fontSize: fontSize.sizeContent,
    fontWeight: "bold",
  },
  leftItem: {
    marginRight: scale(40),
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: space.bgPadding,
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionText: {
    fontSize: fontSize.size26,
    color: "#fff",
  },
  actionIcon: {
    fontSize: scale(25),
    color: "#fff",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: color.grey,
    paddingHorizontal: space.componentMargin / 2,
    paddingVertical: scale(20),
  },
  deleteBox: {
    paddingVertical: space.itemMargin,
    borderRadius: space.border,
    borderStyle: "dashed",
    borderWidth: scale(1),
    borderColor: color.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  titleSymbol: {
    color: color.danger,
  },
});

export default injectIntl(SimpleDetail);
