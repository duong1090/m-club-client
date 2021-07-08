import React, { useState } from "react";
import { View, Image, ImageBackground } from "react-native";
import { Navigation } from "react-native-navigation";
import InformationPage from "./component/InformationPage";
import { scale, color, space } from "container/variables/common";

const SignUp = (props) => {
  //props
  const { componentId } = props;

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: false,
    },
  });

  const header = () => {
    return (
      <ImageBackground
        style={styles.header}
        source={require("container/asset/image/backgroundlogin.png")}
      >
        <Image
          style={styles.logo}
          source={require("container/asset/image/MclubLogo.png")}
        />
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      {header()}
      <InformationPage style={styles.information} />
    </View>
  );
};

const styles = {
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: scale(-400),
  },
  elTwoHeader: {
    width: scale(400),
    height: scale(390),
    position: "absolute",
    right: scale(-120),
    bottom: scale(-180),
    paddingRight: scale(50),
    paddingBottom: scale(150),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(200),
    backgroundColor: "#fff",
  },
  logo: {
    width: scale(300),
    height: scale(300),
    resizeMode: "contain",
  },
  information: {
    margin: scale(60),
  },
};

export default SignUp;
