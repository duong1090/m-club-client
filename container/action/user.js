import { setItem } from "container/utils/storage";
import { API_TOKEN, LANG } from "container/constant/storage";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { gotoHome } from "container/utils/router";
import { showSpinner, hideSpinner } from "container/utils/router";

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

export const loginSuccess = (token) => {
  setItem(API_TOKEN, token);
  gotoHome();
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

export const getOrganization = () => {
  return new Promise((resolve, reject) => {
    getRequest(Config.API_URL.concat("auth/organization"))
      .then((res) => {
        if (res && res.data) {
          resolve(res.data);
          if (res.data.lang) setItem(LANG, res.data.lang);
        }
      })
      .catch((err) => reject(err));
  });
};
