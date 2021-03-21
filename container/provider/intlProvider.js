import React from "react";
import { IntlProvider } from "react-intl";
import { Text, Platform } from "react-native";
import { translationMessages } from "../translation/i18n";

const IntlMainProvider = (props) => {
  const { children } = props;

  const lang = global.lang ? global.lang : "en";

  console.log("IntlMainProvider:::", lang);

  return (
    <IntlProvider
      locale={lang}
      key={lang}
      textComponent={Text}
      messages={translationMessages[lang]}
    >
      {React.Children.only(children)}
    </IntlProvider>
  );
};

export default IntlMainProvider;
