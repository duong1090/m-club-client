import { getApiToken } from "./common";
import { buildDeviceInfo } from "./common";
import { Text, Alert } from "react-native";
import { getItem } from "./storage";
import { LANG, API_TOKEN } from "container/constant/storage";

const constants = {
  APP_JSON_HEADER: "application/json",
  SAME_ORIGIN: "same-origin",
};

const HttpCodes = {
  OK: 200,
  UNAUTHORIZED: 401,
  ENTITY_TOO_LARGE: 413,
};

const showServerError = (error, cb) => {
  console.log("showServerError", error.message);

  const message = error.message ? (
    <Text>{error.message}</Text>
  ) : (
    //TODO: declare multi-language
    // <FormattedMessage {...Messages.connect_server_error} />
    "Lỗi kết nối Server"
  );
  const statusCode = error.response ? `${error.response.status}` : "";
  //TODO: declare Spinner
  //hideSpinner();

  console.error("showServerError:::", message, statusCode);

  //TODO: declare showSystemAlert
  // showSystemAlert({
  //   title: message,
  //   content: `${getIntl().formatMessage(Messages.error_info)}${statusCode}`,
  //   onPressOkButton: () => {
  //     cb && cb();
  //   },
  //   okButtonText: getIntl().formatMessage(Messages.close),
  //   isSingle: true,
  // });
};

const checkStatus = (response) => {
  console.log("checkStatus", response);
  return new Promise((resolve, reject) => {
    var quiet = this.quiet;
    var error;
    if (quiet === undefined) {
      quiet = false;
    }
    if (response.status === HttpCodes.UNAUTHORIZED && !quiet) {
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

      response.json().then((json) => console.log("responesJSON:::", json));

      // error.response = response;
      // error.data = [response.statusText];
      // notify(error);
      // console.log('status not acceptable ')
      // console.log(error);
      showServerError(error, () => {
        error.message = response.statusText
          ? `${response.statusText}`
          : `${response.status}`;
        reject(error);
      });
      error.message = response.statusText
        ? `${response.statusText}`
        : `${response.status}`;
      reject(error);
    } else {
      // let rnfbResp = response.rawResp();

      // console.log('rnfbResp', response.json());

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

              console.error("checkStatus:::", message);

              //TODO:
              // Alert.alert(
              //   global._intl.formatMessage(Messages.notify_setting_title),
              //   message,
              //   [
              //     {
              //       text: global._intl.formatMessage(Messages.ok),
              //       onPress: () => {
              //         reject(error);
              //       },
              //     },
              //   ],
              //   { cancelable: false }
              // );
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
  console.log("postUpload");

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
      console.log("************* postRequest **********:");
      console.log(url);
      console.log(params);
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
  console.log("tokkenenene", token);
  const lang = await getItem(LANG);

  if (params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map((k) => esc(k) + "=" + esc(params[k]))
      .join("&");
    if (query) uri = uri + "?" + query;
  }
  console.log("getRequest ++++++++");
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
      console.log("************* getRequest **********:");
      console.log(url);
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
