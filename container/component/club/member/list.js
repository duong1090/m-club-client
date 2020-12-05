import React, { useEffect } from "react";
import { View } from "react-native";
import SimpleList from "container/component/ui/simpleList";
import screens from "container/constant/screen";
import { gotoRoute } from "container/utils/router";
import { Icon } from "native-base";
import { scale, defaultText } from "container/variables/common";
import Messages from "container/translation/Message";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";

const data = [
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
  { name: "Pham Thai Duong", description: "Chu nhiem" },
  { name: "Le Duc Khang", description: "Pho chu nhiem" },
];

const MemberList = (props) => {
  const { componentId, intl } = props;

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.member),
      },
    },
  });

  //#region  navigate
  const gotoRecord = (mode) => {
    gotoRoute(screens.MEMBER_RECORD);
  };

  //#endregion

  //#region event - function
  const onPressItem = (item) => {};
  
  //#endregion

  //render
  return (
    <View>
      <SimpleList
        data={data}
        addNewItem={gotoRecord}
        styleTextItem={{ fontWeight: "bold" }}
        onPressItem={(item) => onPressItem(item)}
        iconItem={
          <Icon name="home" style={{ ...defaultText, fontSize: scale(30) }} />
        }
      />
    </View>
  );
};

export default injectIntl(MemberList);
