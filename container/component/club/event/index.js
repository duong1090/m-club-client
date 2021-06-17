import { ScrollableTab, Tab, Tabs } from "native-base";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import List from "./component/list";
import QRScanner from "./component/qrScanner";

const Event = (props) => {
  //props
  const { componentId, intl } = props;

  //variables
  const qrScanRef = useRef(null);

  const gotoQRCode = () => {
    console.log("gotoQRCode:::", qrScanRef);
    qrScanRef.current && qrScanRef.current.show();
  };

  //event button navigation
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      if (buttonId == "qr_code") gotoQRCode();
    }
  );

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.event),
      },
      rightButtons: [
        {
          id: "qr_code",
          icon: require("container/asset/icon/qr_code.png"),
        },
      ],
    },
  });

  //render -------------------------------------------------------------------------------------------------------

  return (
    <View style={{ height: "100%" }}>
      <List />
      <QRScanner ref={qrScanRef} />
    </View>
  );
};

export default injectIntl(Event);

const styles = StyleSheet.create({});
