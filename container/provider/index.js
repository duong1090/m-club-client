import React from "react";
import { IntlProvider } from "react-intl";
import { Text, View } from "react-native";
import { translationMessages } from "../translation/i18n";
import { RecoilRoot } from "recoil";

const MainProvider = (props) => {
  const { children } = props;

  return (
    <IntlProvider
      locale="en"
      key="en"
      textComponent={Text}
      messages={translationMessages["en"]}
    >
      <RecoilRoot>{React.Children.only(children)}</RecoilRoot>
    </IntlProvider>
  );
};

export default MainProvider;
