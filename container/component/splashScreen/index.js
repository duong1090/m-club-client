import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { scale } from "container/variables/common";
import LottieView from "lottie-react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        {/* <LottieView
          source={require("container/asset/lottie/progress.json")}
          style={styles.logoLottie}
          autoPlay
          loop
        /> */}
        <Image
          style={styles.logo}
          source={require("container/asset/image/MclubLogo.png")}
        />
      </View>
      <LottieView
        source={require("container/asset/lottie/splash.json")}
        style={styles.loadingLottie}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBox: {
    width: scale(300),
    height: scale(300),
    paddingBottom: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  logoLottie: {
    width: scale(300),
    height: scale(300),
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logo: {
    width: scale(300),
    height: scale(300),
    resizeMode: "contain",
  },
  loadingLottie: {
    width: scale(300),
    height: scale(300),
  },
});

export default SplashScreen;
