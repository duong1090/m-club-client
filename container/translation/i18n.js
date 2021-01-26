// import { addLocaleData } from "react-intl";
// import enLocaleData from "react-intl/locale-data/en";
// import viLocaleData from "react-intl/locale-data/vi";
import enTranslationMessages from "./en.json";
import viTranslationMessages from "./vi.json";
import { DEFAULT_LOCALE } from "container/constant/config";

// addLocaleData(enLocaleData);
// addLocaleData(viLocaleData);
export const appLocales = ["en", "vi"];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages("en", enTranslationMessages),
  vi: formatTranslationMessages("vi", viTranslationMessages),
};
