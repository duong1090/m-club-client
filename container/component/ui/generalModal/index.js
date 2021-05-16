import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "./component/actionSheet";
import {
  scale,
  space,
  defaultText,
  fontSize,
} from "container/variables/common";

const GeneralModal = (props, ref) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [childOptions, setChildOptions] = useState({});

  //hooks ---------------------------------------------------------------------------------------------
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function ------------------------------------------------------------------------------------------
  const show = (object) => {
    const { type, options } = object;
    setType(type);
    setChildOptions(options);

    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  //render --------------------------------------------------------------------------------------------\

  const renderContent = () => {
    switch (type) {
      case "actionSheet":
        return <ActionSheet {...childOptions} hide={() => hide()} />;
    }
  };

  return (
    <Modal
      isVisible={visible}
      style={styles.modalWrapper}
      backdropOpacity={0.8}
      onBackdropPress={() => hide()}
      useNativeDriver={true}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
    >
      <View style={styles.container}>{renderContent()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    margin: space.componentMargin,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: space.border,
  },
});

export default forwardRef(GeneralModal);
