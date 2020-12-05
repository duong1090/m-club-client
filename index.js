/**
 * @format
 */
import "intl";
import { Platform } from "react-native";

if (Platform.OS === "android") {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof Intl.__disableRegExpRestore === "function") {
    Intl.__disableRegExpRestore();
  }
}
import "intl/locale-data/jsonp/en";

import { registerLazyScreen } from "./container/utils/screen";

registerLazyScreen();
