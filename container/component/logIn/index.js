import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { scale, color, space } from "container/variables/common";
import InformationPage from "./component/InformationPage";
import InputItem from "container/component/ui/inputItem";
import { API_URL } from "container/constant/storage";
import { setItem } from "container/utils/storage";

const LogIn = () => {
  const [visibleURLInput, setVisibleURLInput] = useState(0);

  const doChangeApiURL = (text) => {
    setItem(API_URL, text);
  };

  const doCountApiURL = () => {
    setVisibleURLInput(visibleURLInput + 1);
  };

  const header = () => {
    return (
      <ImageBackground
        style={styles.header}
        source={require("container/asset/image/backgroundlogin.png")}
      >
        {visibleURLInput >= 10 ? (
          <InputItem
            style={{ width: "100%", padding: scale(30) }}
            placeholder="API URL"
            onChangeText={(text) => doChangeApiURL(text)}
          />
        ) : null}
        <TouchableOpacity activeOpacity={1} onPress={() => doCountApiURL()}>
          <Image
            style={styles.logo}
            source={require("container/asset/image/MclubLogo.png")}
          />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
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
    marginTop: space.componentMargin,
  },
});

export default LogIn;
