import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "./component/actionSheet";
import {
  scale,
  space,
  defaultText,
  fontSize,
} from "container/variables/common";
import { back } from "../../../utils/router";

const GeneralModal = (props, ref) => {
  const { type, options } = props;

  console.log("GeneralModal", props);

  //render --------------------------------------------------------------------------------------------\

  const renderContent = () => {
    console.log("renderContent::::", type, options);

    switch (type) {
      case "actionSheet":
        return <ActionSheet {...options} hide={() => back()} />;
    }
  };

  return (
    <TouchableOpacity style={styles.modalWrapper} onPress={() => back()}>
      <View style={styles.container}>{renderContent()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: space.componentMargin,
    elevation: 2,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: space.border,
    elevation: 2,
  },
});

export default GeneralModal;
