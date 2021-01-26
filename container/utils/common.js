import { setItem, getItem } from "./storage";
import { Text } from "react-native";

import { API_TOKEN, LANG } from "container/constant/storage";
import DeviceInfo from "react-native-device-info";
import JailMonkey from "jail-monkey";
import { createIntl, createIntlCache } from "react-intl";
import { translationMessages } from "../translation/i18n";

let Base64 = null;

const intlCache = createIntlCache();

export const setApiToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      setItem(API_TOKEN, token, (err) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getApiToken = () => {
  const apiToken = getItem(API_TOKEN);
  if (apiToken) return apiToken;
  return null;
};

export const buildDeviceInfo = async () => {
  try {
    if (!global.buildDeviceInfo) {
      console.log("buildDeviceInfo:::");
      if (Base64 == null) {
        Base64 = require("js-base64").Base64;
      }
      let osVersion = DeviceInfo.getSystemVersion();
      let imei = DeviceInfo.getUniqueId();
      let name = await DeviceInfo.getDeviceName();
      let id = DeviceInfo.getDeviceId();
      let os = DeviceInfo.getSystemName();
      let packageName = DeviceInfo.getBundleId();
      const rooted = JailMonkey.isJailBroken();
      const mockLocation = JailMonkey.canMockLocation();
      const appVersion = DeviceInfo.getReadableVersion();
      const buildVersion = DeviceInfo.getBuildNumber();
      let objJsonStr = JSON.stringify({
        imei,
        name,
        id,
        os,
        osVersion,
        packageName,
        appVersion,
        rooted,
        mockLocation,
        buildVersion,
      });
      let objJsonB64 = Base64.encode(objJsonStr);
      console.log("objJsonB64::", objJsonStr, objJsonB64);
      global.buildDeviceInfo = objJsonB64;
    }
  } catch (e) {
    console.error("buildDeviceInfo", e);
  } finally {
    return global.buildDeviceInfo;
  }
};

export const setIntl = async () => {
  const lang = await getItem(LANG);
  console.log("setIntl::::", lang);
  const intl = createIntl(
    {
      locale: lang ? lang : "en",
      key: lang ? lang : "en",
      messages: lang ? translationMessages[lang] : translationMessages["en"],
      textComponent: Text,
    },
    intlCache
  );
  global.intl = intl;
};

export const getIntl = () => {
  if (!global.intl) {
    global.intl = createIntl(
      {
        locale: "en",
        messages: translationMessages["en"],
        textComponent: Text,
      },
      intlCache
    );
  }
  return global.intl;
};
