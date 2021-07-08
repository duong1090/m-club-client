import { setItem, removeItem } from "container/utils/storage";
import { API_TOKEN, LANG } from "container/constant/storage";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { gotoHome, gotoLogin } from "container/utils/router";
import { ORGANIZATION } from "../constant/storage";
import OneSignal from "react-native-onesignal"; // Import package from node modules
import moment from "moment";
import firebase from "../config/firebase.config";
import { showModal } from "../utils/router";
import { getIntl } from "../utils/common";
import Messages from "../translation/Message";

const TAG_ONE_SIGNAL = [
  "id",
  "club_id",
  "department_id",
  "position_id",
  "is_root",
  "phone",
  "identification",
  "sex",
  "lang",
];

export const doLogin = async (payload) => {
  return new Promise((resolve, reject) => {
    postRequest("auth/login", payload)
      .then((res) => {
        if (res && res.data) {
          loginSuccess(res.data);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
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
      const tags = TAG_ONE_SIGNAL.reduce((obj, tag) => {
        obj[tag] = data.member[tag];
        return obj;
      }, {});

      OneSignal.sendTags(tags);
    }
  } else {
    const temp = await getItem(ORGANIZATION);
    if (temp) global.organization = JSON.parse(temp);
  }
};

export const preValidateLogin = (payload) => {
  const { phone } = payload;

  return new Promise((resolve, reject) => {
    getRequest("auth/get-club-by-phone", { phone })
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
          firebase.auth().signOut();
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
    getRequest("auth/organization")
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
    return Config().API_IMAGE(`avatar/${id}.jpg`);
  }
  return null;
};

export const checkPlayServicesAdvanced = async () => {
  const utils = firebase.firebase.utils();

  const {
    status,
    isAvailable,
    hasResolution,
    isUserResolvableError,
  } = utils.playServicesAvailability;

  console.log(
    "checkPlayServicesAdvanced:::",
    status,
    isAvailable,
    hasResolution,
    isUserResolvableError
  );

  // all good and valid \o/
  if (isAvailable) return;
  // if the user can resolve the issue i.e by updating play services
  // then call Google Play's own/default prompting functionality
  else if (isUserResolvableError || hasResolution) {
    switch (status) {
      case 1:
        // SERVICE_MISSING - Google Play services is missing on this device.
        // show something to user
        // and then attempt to install if necessary
        const options = {
          options: {
            title: getIntl().formatMessage(Messages.announcement),
            content: getIntl().formatMessage(Messages.google_services_missing),
            okText: getIntl().formatMessage(Messages.install),
            onOk: () => utils.makePlayServicesAvailable(),
            onCancel: () => utils.promptForPlayServices(),
          },
          type: "confirm",
        };
        showModal(options);
        break;
      case 2:
        // SERVICE_VERSION_UPDATE_REQUIRED - The installed version of Google Play services is out of date.
        // show something to user
        // and then attempt to update if necessary
        return utils.resolutionForPlayServices();
      // TODO handle other cases as necessary, see link below for all codes and descriptions
      // TODO e.g. https://developers.google.com/android/reference/com/google/android/gms/common/ConnectionResult#SERVICE_VERSION_UPDATE_REQUIRED
      default:
        // some default dialog / component?
        if (isUserResolvableError) return utils.promptForPlayServices();
        if (hasResolution) return utils.resolutionForPlayServices();
    }
  }

  // There's no way to resolve play services on this device
  // probably best to show a dialog / force crash the app
  else {
    const options = {
      type: "error",
      options: {
        content: getIntl().formatMessage(
          Messages.unable_find_valid_google_services
        ),
      },
    };
    showModal(options);
  }
};
