import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { getIntl } from "../../../../utils/common";
import Messages from "../../../../translation/Message";
import { color, fontSize, scale, space } from "../../../../variables/common";

const Error = (props) => {
  //variables

  const doOk = () => {
    props.onOk();
    props.hide();
  };

  //render

  const renderTitle = () => {
    return <Text style={styles.titleText}>{props.title}</Text>;
  };

  const renderContent = () => {
    return <Text style={styles.contentText}>{props.content}</Text>;
  };

  const renderAction = () => {
    return (
      <View style={styles.actionBox}>
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
    color: color.danger,
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

Error.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  okText: PropTypes.string,
  onOk: PropTypes.func,
  hide: PropTypes.func,
};

Error.defaultProps = {
  title: getIntl().formatMessage(Messages.error),
  content: "",
  okText: "OK",
  onOk: () => {},
  hide: () => {},
};

export default Error;
