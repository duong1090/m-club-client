import React from "react";
import { IntlProvider } from "react-intl";
import { Text, Platform } from "react-native";
import { translationMessages } from "../translation/i18n";
import { useRecoilValue } from "recoil";
import { userState } from "container/recoil/state/user";

const IntlMainProvider = (props) => {
  const { children } = props;
  const user = useRecoilValue(userState);

  const lang = user && user.lang ? user.lang : "en";

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
