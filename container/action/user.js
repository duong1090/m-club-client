import { setItem, removeItem } from "container/utils/storage";
import { API_TOKEN, LANG } from "container/constant/storage";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { gotoHome, gotoLogin } from "container/utils/router";
import { showSpinner, hideSpinner } from "container/utils/router";
import { ORGANIZATION } from "../constant/storage";
import OneSignal from "react-native-onesignal"; // Import package from node modules
import moment from 'moment';

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
  const data = await getOrganization();
  if (data) {
    global.organization = data;
    setItem(ORGANIZATION, JSON.stringify(data));
    console.log("organizationnn", data);
    if (data.member && data.club) {
      OneSignal.sendTags({
        mem_id: data.member.id,
        club_id: data.club.id,
      });
    }
  } else {
    const temp = await getItem(ORGANIZATION);
    if (temp) global.organization = JSON.parse(temp);
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
      OneSignal.getTags((receivedTags) => {
        console.log("receivedTags", receivedTags);
        OneSignal.deleteTag("mem_id");
        OneSignal.deleteTag("club_id");
      });
      // OneSignal.deleteTag('userId');
      // OneSignal.deleteTag('username');
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
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAvatarSource = (data = {}) => {
  if (data && (data.id || data.user_id)) {
    const id = data.id || data.user_id;
    console.log('getAvatarSource:::', Config.API_IMAGE.concat(`avatar/${id}.jpg?${moment().unix()}`))
    return Config.API_IMAGE.concat(`avatar/${id}.jpg?${moment().unix()}`);
  }
  return null;
  // return Config.API_IMAGE.concat(`avatar/ava.jpg`);
};
