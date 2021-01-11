import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";
import { setIntl } from "container/utils/common";
import { getOrganization, logOut } from "../action/user";
import { ORGANIZATION } from "../constant/storage";
import { setItem, getItem } from "../utils/storage";
import OneSignal from "react-native-onesignal"; // Import package from node modules

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);
  console.log("loadInitialStatus:::", apiToken);

  configOneSignal();

  await setIntl();
  if (apiToken) {
    gotoHome();
    //loading organization when app start
    try {
      const org = await getOrganization();
      if (org) {
        global.organization = org;
        setItem(ORGANIZATION, JSON.stringify(org));
      } else {
        const temp = await getItem(ORGANIZATION);
        if (temp) global.organization = JSON.parse(temp);
      }
    } catch (err) {
      logOut();
    }
  } else gotoLogin();
};

const configOneSignal = () => {
  const onReceived = (notification) => {
    console.log("OneSignal:::: onReceived");
    console.log("Notification received: ", notification);
  };
  const onOpened = (openResult) => {
    const { additionalData } = openResult.notification.payload;
    gotoRoute(additionalData.route, {
      data: { id: additionalData.id },
      mode: "detail",
    });

    console.log("OneSignal:::: onOpened");
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  };

  const onIds = (device) => {
    console.log("OneSignal:::: onIds");
    console.log("Device info: ", device);
  };
  // const myiOSPromptCallback = (permission) => {
  //   // do something with permission value
  // }
  //Remove this method to stop OneSignal Debugging
  OneSignal.setLogLevel(6, 0);

  // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  const log = OneSignal.init("dfc57d2a-3657-4773-8073-2ff13aed2eb2", {
    kOSSettingsKeyAutoPrompt: false,
    kOSSettingsKeyInAppLaunchURL: false,
    kOSSettingsKeyInFocusDisplayOption: 2,
    // kOSSettingsKeyAutoPrompt: false,
    // kOSSettingsKeyInAppLaunchURL: false,
    // kOSSSettingsKeyPromptBeforeOpeningPushURL: false,
  });
  console.log("OneSignal:::: init", log);
  OneSignal.enableSound(true);

  OneSignal.inFocusDisplaying(2);
  OneSignal.addEventListener("received", onReceived);
  OneSignal.addEventListener("opened", onOpened);
  OneSignal.addEventListener("ids", onIds);
};
