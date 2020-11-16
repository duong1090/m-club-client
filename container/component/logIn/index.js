import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";
import { scale, color, fontSize } from "container/variables/common";
import InformationPage from "./InformationPage";
import InputItem from "container/component/ui/inputItem";

const LogIn = () => {
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

const styles = StyleSheet.create({
  container: {},
  header: {
    height: scale(300),
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
  logo: {
    width: scale(160),
    height: scale(160),
    resizeMode: "contain",
  },
  information: {
    margin: scale(60),
  },
});

export default LogIn;
