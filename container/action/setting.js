import { setItem, getItem } from "../utils/storage";
import { ORGANIZATION, LANG } from "../constant/storage";
import CodePush from "react-native-code-push";

export const setLanguage = async (lang) => {
  console.log("setLanguage:::", lang);
  await setItem(LANG, lang);
  CodePush.restartApp();
};
