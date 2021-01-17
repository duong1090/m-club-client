import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { Navigation } from "react-native-navigation";
import { screens } from "../constant/screen";

export const getNumberOfNotification = () => {
  return new Promise((resolve, reject) => {
    getRequest(Config.API_URL.concat("notification/get"), {
      type: "count-unread",
    })
      .then((res) => {
        if (res && res.data) {
          global.numberOfNotification = res.data;
          resolve(res.data);
        }
      })
      .catch((err) => reject(err));
  });
};

export const getUserInfo = async () => {
  const notiNumber = await getNumberOfNotification();
  //merge unread notification number
  if (notiNumber) {
    Navigation.mergeOptions(screens.TAB_NOTIFICATION, {
      bottomTab: {
        ...{ badge: notiNumber ? `${notiNumber}` : null },
      },
    });
  }
};
