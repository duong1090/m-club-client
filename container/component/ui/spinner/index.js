import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { scale } from "container/variables/common";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";

const Spinner = (props, ref) => {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0}
      style={overlay}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={1}
      animationOutTiming={1}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: scale(100),
          height: scale(100),
          borderRadius: scale(50),
        }}
      >
        <View
          style={{
            width: scale(80),
            height: scale(80),
          }}
        >
          <LottieView
            source={require("container/asset/lottie/loading.json")}
            autoPlay
            loop
          />
        </View>
      </View>
    </Modal>
  );
};

const overlay = {
  alignItems: "center",
  justifyContent: "center",
};

export default forwardRef(Spinner);
