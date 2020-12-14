import AsyncStorage from "@react-native-community/async-storage";
import { API_TOKEN, LANG, IS_RECENT_TIME } from "container/constant/storage";

export const setItem = async (...args) => {
  await AsyncStorage.setItem(...args);
};

export const getItem = async (...args) => {
  try {
    const value = await AsyncStorage.getItem(...args);
    if (value != null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
    return null;
  }
};

export const removeItem = async (...args) => {
  await AsyncStorage.removeItem(...args);
};

export const getAllItem = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const items = await AsyncStorage.multiGet(keys);
  return items
    .filter(
      (item, index, store) =>
        store[index][0] != API_TOKEN &&
        store[index][0] != LANG &&
        store[index][0] != IS_RECENT_TIME
    )
    .map((item, index, store) => {
      return {
        key: store[index][0],
        value: store[index][1],
      };
    });
};
