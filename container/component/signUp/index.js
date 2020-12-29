import React, { useState } from "react";
import { View, Image } from "react-native";
import InformationPage from "./InformationPage";
import { scale, color } from "container/variables/common";

const SignUp = () => {
  const header = () => {
    return (
      <View style={styles.header}>
        <View style={styles.elOneHeader}></View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
          }}
        >
          <View style={styles.elTwoHeader}>
            <Image
              style={styles.logo}
              source={require("container/asset/image/Mclub-cirLogo.png")}
            />
          </View>
        </View>
      </View>
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
  container: {},
  header: {
    height: scale(300),
    marginBottom: scale(100),
  },
  elOneHeader: {
    height: scale(220),
    backgroundColor: color.background,
  },
  elTwoHeader: {
    width: scale(164),
    height: scale(164),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(82),
    borderWidth: scale(4),
    borderColor: color.fontColor,
    backgroundColor: "#fff",
  },
  information: {
    margin: scale(60),
  },
  logo: {
    width: scale(160),
    height: scale(160),
    resizeMode: "contain",
  },
};

export default SignUp;
