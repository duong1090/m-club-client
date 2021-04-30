import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { scale, color, fontSize } from "container/variables/common";
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
          {visibleURLInput >= 10 ? (
            <InputItem
              style={{ width: "100%", padding: scale(30) }}
              placeholder="API URL"
              onChangeText={(text) => doChangeApiURL(text)}
            />
          ) : null}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.elTwoHeader}
            onPress={() => doCountApiURL()}
          >
            <Image
              style={styles.logo}
              source={require("container/asset/image/Mclub-cirLogo.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        {header()}
        <InformationPage style={styles.information} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
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
