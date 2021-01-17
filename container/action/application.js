import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";

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
