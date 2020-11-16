import { setItem, getItem } from "./storage";
import { API_TOKEN } from "container/constant/storage";
import DeviceInfo from "react-native-device-info";
import JailMonkey from "jail-monkey";

let Base64 = null;

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
