import AsyncStorage from "@react-native-community/async-storage";

export const setItem = async (...args) => {
  await AsyncStorage.setItem(...args);
};

export const getItem = async (...args) => {
  try {
    const value = await AsyncStorage.getItem(...args);
    if (value !== null) {
      // value previously stored
    }
  } catch (e) {
    // error reading value
  }
};

export const removeItem = async (...args) => {
  await AsyncStorage.removeItem(...args);
};
