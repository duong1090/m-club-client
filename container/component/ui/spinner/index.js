import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { scale } from "container/variables/common";
import LottieView from "lottie-react-native";

const Spinner = () => {
  const opacity = useState(new Animated.Value(0))[0];

  const fadeIn = () => {
    console.log("fadeIn:::::");

    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    console.log("fadeOut:::::");

    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View style={[overlay, { opacity }]}>
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
    </Animated.View>
  );
};

const overlay = {
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

export default Spinner;
