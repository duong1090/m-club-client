import React from "react";
import { screens } from "container/constant/screen";
import { Navigation } from "react-native-navigation";
import { loadInitialStatus } from "container/action/initialize";
import MainProvider from "container/provider";

//#region Register Screen ------------------------------------------------------------------------------------------------

export const registerLazyScreen = () => {
  registerComponent(screens.LOGIN.value, screens.SIGNUP.screen);
  registerComponent(screens.SIGNUP.value, screens.SIGNUP.screen);
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

const onAppLaunched = () => {
  loadInitialStatus();
};

Navigation.events().registerAppLaunchedListener(onAppLaunched);
