import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import {
  scale,
  space,
  defaultText,
  fontSize,
} from "container/variables/common";
import Modal from "react-native-modal";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

const BottomPopUp = (props, ref) => {
  const { body, toolbar, title, reset } = props;

  //state
  const [visible, setVisible] = useState(false);

  //effect
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event
  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    reset && reset();
    setVisible(false);
  };

  //render

  return (
    <Modal
      isVisible={visible}
      style={styles.modalWrapper}
      backdropOpacity={0.8}
      // onSwipeComplete={() => hide()}
      onBackdropPress={() => hide()}
      // useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      // swipeDirection={["down"]}
      propagateSwipe
    >
      <View style={styles.bodyWrapper}>
        {title ? (
          <View style={styles.titleBox}>
            <Text style={styles.textTitle}>{title}</Text>
          </View>
        ) : null}
        {body}
        {toolbar ? <View style={[styles.toolbar]}>{toolbar()}</View> : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalWrapper: {
    margin: 0,
    justifyContent: "flex-end",
  },

  bodyWrapper: {
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    paddingHorizontal: scale(30),
    paddingVertical: scale(30),
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.componentMargin * 2,
  },
  textTitle: {
    ...defaultText,
    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
  },
});

export default forwardRef(BottomPopUp);
