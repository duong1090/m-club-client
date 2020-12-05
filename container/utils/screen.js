import React from "react";
import screens from "../constant/screen";
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

  registerComponent(
    screens.LOGIN,
    require("container/component/logIn").default
  );
  registerComponent(
    screens.SIGNUP,
    require("container/component/signUp").default
  );
  registerComponent(
    screens.MEMBER_RECORD,
    require("container/component/club/member/record").default
  );
  registerComponent(
    screens.MEMBER_LIST,
    require("container/component/club/member/list").default
  );
  registerComponent(
    screens.MEMBER_DETAIL,
    require("container/component/club/member/detail").default
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
      <Screen {...props} />
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
    setCurrentScreen(componentId, componentName, passProps);
  }
);

const onAppLaunched = () => {
  loadInitialStatus();
};

Navigation.events().registerAppLaunchedListener(onAppLaunched);

//#endregion
