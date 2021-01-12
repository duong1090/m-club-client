import React from "react";
import { screens, modals } from "../constant/screen";
import { Navigation } from "react-native-navigation";
import { loadInitialStatus } from "../action/initialize";
import MainProvider from "../provider";
import { setCurrentScreen, popNavigatorStack } from "../utils/router";

//#region Register Screen ------------------------------------------------------------------------------------------------

export const registerLazyScreen = () => {
  Navigation.registerComponent(
    screens.SPINNER,
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
  //#endregion

  //#region modal
  registerModalComponent(
    modals.SELECT_MODAL,
    require("container/component/ui/selectModal").default
  );
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
      <Screen {...props} {...defaultProps} />
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
    if (componentName != screens.SPINNER)
      setCurrentScreen(componentId, componentName, passProps);
  }
);

const onAppLaunched = () => {
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
        },
      },
    },
  });
  setTimeout(loadInitialStatus, 2500);
};

Navigation.events().registerAppLaunchedListener(onAppLaunched);

//#endregion
