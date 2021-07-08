import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { scale, space, fontSize, color } from "container/variables/common";

const DISMISS_MODAL_DELAY = 200;

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
                  if (Platform.OS == "ios")
                    setTimeout(() => item.onPress(), DISMISS_MODAL_DELAY);
                  else if (Platform.OS == "android") item.onPress();
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
