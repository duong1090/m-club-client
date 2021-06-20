import React from "react";
import { StyleSheet, View } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
  color,
  scale,
  
  space,
  fontSize,
  shadow,
} from "container/variables/common";
import { Icon } from "native-base";

const QRScanner = (props) => {
  const renderMarker = () => {
    return (
      <View style={styles.markerBox}>
        <View style={styles.markerItem} />
        <View style={{ flexDirection: "row" }}>
          <View style={styles.markerItem}></View>
          <View style={styles.marker} />
          <View style={styles.markerItem}></View>
        </View>
        <View style={styles.markerItem} />
      </View>
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      <QRCodeScanner {...props} />
      {renderMarker()}
      <Icon name="qr-code" style={styles.controlQR} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerBox: {
    position: "absolute",

    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  marker: {
    width: "60%",
    aspectRatio: 1,
    borderWidth: scale(4),
    borderColor: color.success,
  },
  markerItem: {
    flex: 1,
    backgroundColor: "#00000099",
  },
  controlQR: {
    fontSize: scale(50),
    color: "#fff",
    position: "absolute",
    top: space.componentMargin,
    right: space.componentMargin,
  },
});

export default QRScanner;
