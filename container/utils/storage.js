import {AsyncStorage} from '@react-native-community/async-storage';

export const setItem = (...args) => {
  await AsyncStorage.setItem(...args);
}

export const getItem = async(...args) => {
    return await AsyncStorage.getItem(...args);
}

export const removeItem = async(...args) => {
    await AsyncStorage.removeItem(...args);
}