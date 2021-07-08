import React from "react";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { StyleSheet } from "react-native";
const FadedWrapper = (props) => {
  return (
    <MaskedView
      style={{ flex: 1 }}
      maskElement={
        <LinearGradient
          colors={[
            "#FFFFFF00",
            "#FFFFFF",
            "#FFFFFF00",
          ]}
          // colors={["#", "#FFFFFF", "red"]}
          style={styles.linearView}
        />
      }
    >
      {props.children}
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  linearView: {
    flex: 1,
    width: "100%",
    borderRadius: 5,
  },
});

export default FadedWrapper;
