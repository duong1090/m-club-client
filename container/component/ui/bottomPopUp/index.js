import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import { View, StyleSheet, Text } from "react-native";
import { scale, space, fontSize } from "container/variables/common";
import ModalContext from "container/context/modal";
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const BottomPopUp = (props, ref) => {
  const { body, toolbar, title, reset } = props;

  //state
  const [visible, setVisible] = useState(false);
  const { keyboardDidShow } = useContext(ModalContext);

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
      backdropOpacity={0.5}
      onBackdropPress={() => hide()}
      onBackButtonPress={() => hide()}
      useNativeDriver={true}
      propagateSwipe
      coverScreen={false}
    >
      <View style={styles.bodyWrapper}>
        <KeyboardAwareScrollView>
          {title ? (
            <View style={styles.titleBox}>
              <Text style={styles.textTitle}>{title}</Text>
            </View>
          ) : null}
          {body}
          {toolbar ? <View style={[styles.toolbar]}>{toolbar()}</View> : null}
        </KeyboardAwareScrollView>
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
    justifyContent: "flex-end",
    margin: 0,
  },

  awareWrapper: {},

  bodyWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    paddingHorizontal: scale(30),
    paddingVertical: scale(30),
    overflow: "visible",
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.componentMargin * 2,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: fontSize.sizeTitle,
  },
});

export default forwardRef(BottomPopUp);
