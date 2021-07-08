import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { getIntl } from "../../../../utils/common";
import Messages from "../../../../translation/Message";
import { color, fontSize, scale, space } from "../../../../variables/common";

const Confirm = (props) => {
  //variables

  const doCancel = () => {
    props.onCancel();
    props.hide();
  };

  const doOk = () => {
    props.onOk();
    props.hide();
  };

  //render

  const renderTitle = () => {
    return (
      <Text style={styles.titleText}>
        {props.title ? props.title : getIntl().formatMessage(Messages.confirm)}
      </Text>
    );
  };

  const renderContent = () => {
    return <Text style={styles.contentText}>{props.content}</Text>;
  };

  const renderAction = () => {
    return (
      <View style={styles.actionBox}>
        <TouchableOpacity style={styles.btnBox} onPress={() => doCancel()}>
          <Text style={{ color: color.danger }}>
            {props.cancelText
              ? props.cancelText
              : getIntl().formatMessage(Messages.cancel)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnBox} onPress={() => doOk()}>
          <Text style={{ color: color.blue }}>{props.okText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTitle()}
      {renderContent()}
      {renderAction()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleText: {
    fontSize: fontSize.sizeTitle,
    alignSelf: "center",
    margin: space.itemMargin,
    color: color.success,
  },
  contentText: {
    alignSelf: "center",
    fontSize: fontSize.size28,
    margin: space.componentMargin,
  },
  actionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: space.componentMargin,
    marginTop: space.itemMargin,
    borderTopWidth: scale(1),
    borderColor: color.lightGrey,
  },
});

Confirm.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  hide: PropTypes.func,
};

Confirm.defaultProps = {
  title: undefined,
  content: "",
  cancelText: undefined,
  okText: "OK",
  onCancel: () => {},
  onOk: () => {},
  hide: () => {},
};

export default Confirm;
