import { setItem, removeItem } from "container/utils/storage";
import { API_TOKEN, LANG } from "container/constant/storage";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { gotoHome, gotoLogin } from "container/utils/router";
import { showSpinner, hideSpinner } from "container/utils/router";
import { ORGANIZATION } from "../constant/storage";

export const doLogin = async (payload) => {
  showSpinner();
  return new Promise((resolve, reject) => {
    postRequest(Config.API_URL.concat("auth/login"), payload)
      .then((res) => {
        if (res && res.data) {
          loginSuccess(res.data);
          hideSpinner();
        }
      })
      .catch((err) => {
        reject(err);
        hideSpinner();
      });
  });
};

export const loginSuccess = async (token) => {
  gotoHome();
  await setItem(API_TOKEN, token);
  //loading organization
  const res = await getOrganization();
  if (res && res.data) {
    global.organization = res.data;
    setItem(ORGANIZATION, res.data);
  } else {
    const temp = await getItem(ORGANIZATION);
    if (temp) global.organization = temp;
  }
};

export const preValidateLogin = (payload) => {
  const { phone } = payload;

  return new Promise((resolve, reject) => {
    getRequest(Config.API_URL.concat("auth/get-club-by-phone"), { phone })
      .then((res) => {
        if (res && res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => reject(err));
  });
};

export const logOut = () => {
  return new Promise((resolve, reject) => {
    removeUserInfo()
      .then((res) => {
        if (res) {
          resolve(res);
          gotoLogin();
        }
      })
      .catch((err) => reject(err));
  });
};

const removeUserInfo = () => {
  return new Promise((resolve, reject) => {
    try {
      removeItem(API_TOKEN)
        .then(() => resolve(true))
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

export const getOrganization = () => {
  return new Promise((resolve, reject) => {
    getRequest(Config.API_URL.concat("auth/organization"))
      .then((res) => {
        if (res && res.data) {
          console.log("getOrganization:::", res.data);
          resolve(res.data);
          // if (res.data.lang) setItem(LANG, res.data.lang);
        }
      })
      .catch((err) => reject(err));
  });
};

export const getAvatarSource = (data = {}) => {
  if (data && (data.id || data.user_id)) {
    const id = data.id || data.user_id;
    return Config.API_IMAGE.concat(`avatar/${id}.jpg`);
  }
  return null;
  // return Config.API_IMAGE.concat(`avatar/ava.jpg`);
};
