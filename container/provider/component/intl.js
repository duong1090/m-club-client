import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { Text, Platform } from "react-native";
import { translationMessages } from "../../translation/i18n";
import { getItem } from "../../utils/storage";
import { LANG } from "container/constant/storage";
import { setIntl } from "../../utils/common";

const IntlMainProvider = (props) => {
  const { children } = props;
  const [currLang, setCurrLang] = useState(global.lang ? global.lang : "en");

  // useEffect(() => {
  //   checkLanguage();
  // }, []);

  const checkLanguage = async () => {
    const lang = await getItem(LANG);
    if (lang) {
      setCurrLang(lang);
      setIntl(lang);
    }
  };

  return (
    <IntlProvider
      locale={currLang}
      key={currLang}
      textComponent={Text}
      messages={translationMessages[currLang]}
    >
      {React.Children.only(children)}
    </IntlProvider>
  );
};

export default IntlMainProvider;
