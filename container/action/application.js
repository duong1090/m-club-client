import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { Navigation } from "react-native-navigation";
import { screens } from "../constant/screen";

export const getNumberOfNotification = () => {
  getRequest("notification/get", {
    type: "count-unread",
  })
    .then((res) => {
      if (res && res.data) {
        global.numberOfNotification = res.data;
        Navigation.mergeOptions(screens.TAB_NOTIFICATION, {
          bottomTab: {
            ...{ badge: res.data ? `${res.data}` : null },
          },
        });
      }
    })
    .catch((err) => console.error(err));
};

export const getUserInfo = async () => {
  //merge unread notification number
  getNumberOfNotification();
};
