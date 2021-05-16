import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import {
  scale,
  space,
  defaultText,
  fontSize,
  color,
} from "container/variables/common";

const ActionSheet = (props) => {
  //props
  const { actions, hide, style } = props;
  //render

  return (
    <View style={styles.container}>
      {actions.map((item, index) => (
        <TouchableOpacity
          style={styles.itemAction(index)}
          onPress={
            item.onPress
              ? () => {
                  item.onPress();
                  hide();
                }
              : () => hide()
          }
        >
          <Text style={styles.itemText(item.type)}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ActionSheet;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: space.componentMargin,
  },
  itemAction: (index) => ({
    height: scale(100),
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: index > 0 ? scale(1) : 0,
    borderColor: color.lightGrey,
  }),

  itemText: (type) => {
    let textColor = color.blue;

    if (type == "danger") textColor = color.danger;

    return {
      ...defaultText,
      color: textColor,
    };
  },
});

ActionSheet.propsTypes = {
  actions: PropTypes.array,
  hide: PropTypes.func,
};

ActionSheet.defaultProps = {
  actions: [],
  hide: () => {},
};
