import React, { useState } from "react";
import { View } from "react-native";
import List from "./list";
import Detail from "./detail";
import Record from "./record";
import { Navigation } from "react-native-navigation";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";

const Member = (props) => {
  //props
  const { componentId, intl } = props;

  //state
  const [mode, setMode] = useState("list");

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.member),
      },
    },
  });

  //change mode to switch screen
  const onChangeMode = (mode = "list") => {
    console.log("onChangeMode:::", mode);
    setMode(mode);
  };

  //screens
  const tabs = {
    list: <List changeMode={onChangeMode} mode={mode} />,
    detail: <Detail changeMode={onChangeMode} mode={mode} />,
    edit: <Record changeMode={onChangeMode} mode={mode} />,
    create: <Record changeMode={onChangeMode} mode={mode} />,
  };

  //render
  return <View>{tabs[mode]}</View>;
};

export default injectIntl(Member);
