import React from "react";
import { screens, modals } from "../constant/screen";
import { Navigation } from "react-native-navigation";
import MainProvider from "../provider";
import { setCurrentScreen, popNavigatorStack } from "../utils/router";
import OneSignal from "react-native-onesignal"; // Import package from node modules
import { gotoRoute } from "container/utils/router";
import { SafeAreaView } from "react-native";
import { ONE_SIGNAL_APP_ID } from "../constant/release";

//#region Register Screen ------------------------------------------------------------------------------------------------

global.pendingNotification = null;

export const registerLazyScreen = () => {
  Navigation.registerComponent(
    modals.SPINNER,
    () => require("container/component/ui/spinner").default
  );

  //#region component
  registerComponent(
    screens.LOGIN,
    require("container/component/logIn").default
  );
  registerComponent(
    screens.SIGNUP,
    require("container/component/signUp").default
  );
  registerComponent(
    screens.MEMBER,
    require("container/component/club/member").default
  );
  registerComponent(
    screens.TAB_ACCOUNT,
    require("container/component/tabAccount").default
  );
  registerComponent(
    screens.TAB_NAVIGATE,
    require("container/component/tabNavigate").default
  );
  registerComponent(
    screens.TAB_NOTIFICATION,
    require("container/component/tabNotification").default
  );
  registerComponent(
    screens.TAB_TASK,
    require("container/component/tabTask").default
  );

  registerComponent(
    screens.DEPARTMENT,
    require("container/component/club/department").default
  );

  registerComponent(
    screens.POSITION,
    require("container/component/club/position").default
  );
  registerComponent(
    screens.FUNDS,
    require("container/component/club/funds").default
  );
  registerComponent(
    screens.USER_INFO,
    require("container/component/info/user").default
  );
  registerComponent(
    screens.SETTING,
    require("container/component/setting").default
  );
  registerComponent(
    screens.SPLASH_SCREEN,
    require("container/component/splashScreen").default
  );

  registerComponent(
    screens.ROLE,
    require("container/component/club/role").default
  );
  registerComponent(
    screens.EVENT,
    require("container/component/club/event").default
  );
  registerModalComponent(
    modals.GENERAL_MODAL,
    require("container/component/ui/generalModal").default
  );

  //#endregion

  //#region modal
  registerModalComponent(
    modals.SELECT_MODAL,
    require("container/component/ui/selectModal").default
  );

  // registerModalComponent(
  //   modals.SPINNER,
  //   require("container/component/ui/spinner").default
  // );

  //#endregion
};

const registerComponent = (
  routeName,
  Screen,
  defaultProps = {},
  isModalScreen = false
) => {
  console.log("registerComponent:::", routeName);

  Navigation.registerComponent(routeName, () => (props) => (
    <MainProvider>
      {isModalScreen ? (
        <Screen {...props} {...defaultProps} />
      ) : (
        <SafeAreaView>
          <Screen {...props} {...defaultProps} />
        </SafeAreaView>
      )}
    </MainProvider>
  ));
};

const registerModalComponent = (routeName, Screen, defaultProps = {}) => {
  registerComponent(routeName, Screen, defaultProps, true);
};

//#endregion ------------------------------------------------------------------------------------------------

//#region event  ------------------------------------------------------------------------------------------------

Navigation.events().registerComponentDidAppearListener(
  ({ componentId, componentName, passProps }) => {
    console.log(
      "registerComponentDidAppearListener::::",
      componentId,
      componentName,
      passProps
    );
    // if (componentName != screens.SPINNER)
    setCurrentScreen(componentId, componentName, passProps);

    //if pendingNotification != null open pending notification

    if (componentName == screens.TAB_NAVIGATE && global.pendingNotification) {
      console.log("pendingNotification::::", global.pendingNotification);
      processOpenNotification(global.pendingNotification);
      // global.pendingNotification = null;
    }
  }
);

const processOpenNotification = (passData) => {
  gotoRoute(passData.route, {
    data: { id: passData.id ? passData.id : null },
    mode: passData.id ? "detail" : "list",
  });
  if (global.pendingNotification) global.pendingNotification = null;
};

const configOneSignal = () => {
  const onReceived = (notification) => {
    console.log("OneSignal:::: onReceived");
    console.log("Notification received: ", notification);
    const { isAppInFocus } = notification;
    if (isAppInFocus) {
      Navigation.mergeOptions(screens.TAB_NOTIFICATION, {
        bottomTab: {
          ...{
            badge: global.numberOfNotification
              ? `${++global.numberOfNotification}`
              : null,
          },
        },
      });
    }
  };

  const onOpened = (openResult) => {
    const { isAppInFocus } = openResult.notification;
    const { additionalData } = openResult.notification.payload;

    if (isAppInFocus) processOpenNotification(additionalData);
    else {
      console.log("onOpened:::Ne", pendingNotification, additionalData);
      pendingNotification = additionalData;
    }

    console.log("OneSignal:::: onOpened");
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  };

  const onIds = (device) => {};
  // const myiOSPromptCallback = (permission) => {
  //   // do something with permission value
  // }
  //Remove this method to stop OneSignal Debugging
  OneSignal.setLogLevel(6, 0);

  // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  const log = OneSignal.init(ONE_SIGNAL_APP_ID, {
    kOSSettingsKeyAutoPrompt: true,
    kOSSettingsKeyInAppLaunchURL: false,
    kOSSettingsKeyInFocusDisplayOption: 2,
  });
  OneSignal.configure();
  console.log("OneSignal:::: init", log);
  OneSignal.enableSound(true);

  OneSignal.inFocusDisplaying(2);
  OneSignal.addEventListener("received", onReceived);
  OneSignal.addEventListener("opened", onOpened);
  OneSignal.addEventListener("ids", onIds);
};

const onAppLaunched = () => {
  configOneSignal();
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screens.SPLASH_SCREEN,
            },
          },
        ],
        options: {
          topBar: { visible: false },
          layout: {
            orientation: ["portrait"],
          },
        },
      },
    },
  });
};

Navigation.events().registerAppLaunchedListener(onAppLaunched);

//#endregion
