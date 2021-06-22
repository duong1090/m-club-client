import { getApiToken, getIntl } from "./common";
import { buildDeviceInfo } from "./common";
import { Text, Alert } from "react-native";
import { getItem } from "./storage";
import Config, { formatURL } from "container/config/server.config";
import { LANG, API_TOKEN, API_URL } from "container/constant/storage";
import Toast from "react-native-simple-toast";
import { gotoRoute } from "./router";
import { modals } from "../constant/screen";
import Messages from "../translation/Message";

const constants = {
  APP_JSON_HEADER: "application/json",
  SAME_ORIGIN: "same-origin",
};

const HttpCodes = {
  OK: 200,
  UNAUTHORIZED: 401,
  ENTITY_TOO_LARGE: 413,
};

const showServerError = (errorMessage, cb) => {
  console.log("showServerError", errorMessage);

  gotoRoute(
    modals.GENERAL_MODAL,
    {
      options: {
        content: errorMessage
          ? error.message
          : getIntl().formatMessage(Messages.error),
      },
      type: "error",
    },
    true
  );
};

const checkStatus = (response) => {
  console.log("checkStatus", response);
  return new Promise((resolve, reject) => {
    // var quiet = this.quiet;
    var error;
    // if (quiet === undefined) {
    //   quiet = false;
    // }
    if (response.status === HttpCodes.UNAUTHORIZED) {
      console.log("CODE" + HttpCodes.UNAUTHORIZED);
      error = new Error(response.statusText);
      error.response = response;
      error.data = [response.statusText];
      //TODO: declare notify
      // notify(error);
      reject(error);
    } else if (response.status != HttpCodes.OK) {
      if (response.status == HttpCodes.ENTITY_TOO_LARGE) {
        error = new Error("Dung lượng tải lên quá lớn");
      } else {
        error = new Error(response.statusText);
      }

      response.json().then((json) => {
        console.log("responesJSON:::", json);

        showServerError(json.message);
      });
    } else {
      response
        .json()
        .then((json) => {
          //const json = res.json();
          console.log("json", json, json.error_code);
          if (json.error_code) {
            let message = "Có lỗi xảy ra. Vui lòng thử lại";
            if (json.message) {
              if (Array.isArray(json.message)) {
                message = json.message.join("\n");
              } else {
                message = json.message;
              }
            }

            error = new Error(message);
            // console.log(json.message);
            error.data = json.message;
            error.error_code = json.error_code;
            if (json.error_code == 400 || json.error_code == 403) {
              // hideSpinner();
              showServerError(message);
              console.error("checkStatus:::", message);
            }
          } else {
            resolve(json);
          }
        })
        .catch((e) => reject(e));
    }
  });
};

//#region POST

const postUpload = async (uri, method = "POST", data, quiet) => {
  const apiURL = await getItem(API_URL);

  if (apiURL) uri = formatURL(apiURL).concat(uri);
  else uri = Config().API_URL.concat(uri);

  console.log("************* postRequest **********:");
  console.log(uri);
  console.log(data);

  const token = await getItem(API_TOKEN);
  const lang = await getItem(LANG);
  const config = {
    retries: 2,
    onRetry: ({ retriesLeft, retryDelay, response }) => {
      // retry on any network error, or 4xx or 5xx status codes
      if (response !== null && response.message == "Network request failed") {
        console.log(response);
        console.log(`retrying, attempt number ${retriesLeft + 1}`);
        return true;
      }
    },
    method: method,
    credentials: constants.SAME_ORIGIN,
    headers: {
      Device: await buildDeviceInfo(),
      Authorization: "Bearer " + token,
      Connection: "close",
      Accept: "multipart/form-data",
      "Content-Type": "multipart/form-data",
      lang: lang ? lang : "en",
      "Cache-Control": "Private, No-Cache",
      Pragma: "no-cache",
      Expires: 0,
    },
    body: data,
  };

  console.log("token:::", token);
  console.log("lang:::", lang);
  console.log("apiConfig:::", config);

  return fetch(uri, config).then(
    checkStatus.bind({
      request: postUpload.bind(undefined, uri, method, data, true),
      quiet: quiet,
    })
  );
};

const postPut = async (uri, method = "POST", data, quiet) => {
  const apiURL = await getItem(API_URL);

  if (apiURL) uri = formatURL(apiURL).concat(uri);
  else uri = Config().API_URL.concat(uri);

  console.log("************* postRequest **********:");
  console.log(uri);
  console.log(data);

  const token = await getItem(API_TOKEN);
  const lang = await getItem(LANG);
  const config = {
    retryDelay: 1000 * 5,
    method: method,
    credentials: constants.SAME_ORIGIN,
    headers: {
      Device: await buildDeviceInfo(),
      Accept: constants.APP_JSON_HEADER,
      "Content-Type": constants.APP_JSON_HEADER,
      Authorization: "Bearer " + token,
      lang: lang ? lang : "en",
      "Cache-Control": "Private, No-Cache",
      Pragma: "no-cache",
      Expires: 0,
    },
    body: JSON.stringify(data),
  };

  console.log("token:::", token);
  console.log("lang:::", lang);
  console.log("apiConfig:::", config);

  return fetch(uri, config).then(
    checkStatus.bind({
      request: postPut.bind(undefined, uri, method, data, true),
      quiet: quiet,
    })
  );
};

export const post = (uri, data = "", quiet = false) => {
  if (data instanceof FormData) {
    return postUpload(uri, "POST", data, quiet);
  } else {
    return postPut(uri, "POST", data, quiet);
  }
};

export const postRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    try {
      // sleep(5000);
      post(url, params)
        .then((data) => {
          console.log("************* postRequest #### SUCCESSED:", url);
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log("************* postRequest #### FAILED:", url);
          console.log(error);
          if (
            error &&
            error.message &&
            error.message.indexOf("request timed out") > -1
          ) {
            const error = new Error();
            error.response = {
              status: "Request_timeout",
              //TODO: multi-language
              // status: getIntl().formatMessage(Messages.request_timeout),
            };
            showServerError(error);
          } else if (
            error &&
            error.message &&
            error.message.indexOf("Unable to resolve host") > -1
          ) {
            //TODO: showNetworkAlert
            // showNetworkAlert(true);
            console.log("showNetworkAlert:::", "network failed");
          }
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
};

//#endregion ---------------------------------------------------------------------------------

//#region GET

export const get = async (uri, params = "", quiet) => {
  const token = await getItem(API_TOKEN);
  const lang = await getItem(LANG);
  const apiURL = await getItem(API_URL);

  if (apiURL) uri = formatURL(apiURL).concat(uri);
  else uri = Config().API_URL.concat(uri);

  console.log("************* getRequest **********:");
  console.log(uri);

  if (params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map((k) => esc(k) + "=" + esc(params[k]))
      .join("&");
    if (query) uri = uri + "?" + query;
  }

  const deviceInfo = await buildDeviceInfo();
  console.log("get", uri, params, deviceInfo);
  console.log("token:::::", token);
  console.log("lang:::", lang);
  const config = {
    retries: 2,
    retryDelay: 1000 * 5,
    onRetry: function ({ retriesLeft, retryDelay, response }) {
      // retry on any network error, or 4xx or 5xx status codes
      if (response !== null && response.message == "Network request failed") {
        console.log(response);
        console.log(`retrying, attempt number ${retriesLeft + 1}`);
        return true;
      }
    },
    method: "GET",
    credentials: constants.SAME_ORIGIN,
    headers: {
      Host: "tao-lao",
      Device: deviceInfo,
      Accept: "application/json",
      Authorization: "Bearer " + token,
      lang: lang ? lang : "en",
      "Cache-Control": "Private, No-Cache",
      Pragma: "no-cache",
      Expires: 0,
    },
  };

  console.log("apiConfig:::", config);

  return fetch(uri, config).then(
    checkStatus.bind({
      request: get.bind(undefined, uri, true),
      quiet: quiet,
    })
  );
};

export const getRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    try {
      get(url, params)
        .then((data) => {
          console.log(`************* getRequest ${url}   #### SUCCESSED:`);
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log(`************* getRequest ${url}  #### FAILED:`);
          console.log(error);
          if (error.message && error.message.indexOf("timed out")) {
            //TODO:
            // notify(error);
            // console.error("getRequest:::", error);
          }
          if (
            error.message &&
            error.message.indexOf("Unable to resolve host") > -1
          ) {
            //TODO: showNetworkAlert
            // showNetworkAlert(true);
            console.log("showNetworkAlert:::", "network failed");
          }
          reject(error);
        });
    } catch (err) {
      console.error("************* getRequest **********:", err);
      if (
        error &&
        error.message &&
        error.message.indexOf("request timed out") > -1
      ) {
        const error = new Error();
        error.response = {
          status: "Request_timeout",
          //TODO: multi-language
          // status: getIntl().formatMessage(Messages.request_timeout),
        };
        showServerError(error);
      }
      //should use to
      //catch programmer error
      reject(err);
    }
  });
};

//#endregion ---------------------------------------------------------------------------------
