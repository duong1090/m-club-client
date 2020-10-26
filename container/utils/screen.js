import { screens } from "container/constant/screen";
import { Navigation } from "react-native-navigation";
import { loadInitialStatus } from "container/action/initialize";

//#region Register Screen ------------------------------------------------------------------------------------------------
const getRequireByKey = (key) => {
  console.log("getRequireByKey:::");
  switch (key) {
    case screens.LOGIN.value:
      return require("container/component/logIn").default;
    case screens.SIGNUP.value:
      return require("container/component/signUp").default;
  }
};

export const registerLazyScreen = () => {
  console.log("registerLazyScreen::::", Navigation.setLazyComponentRegistrator);
  try {
    Navigation.setLazyComponentRegistrator((componentName) => {
      console.log("registerLazyScreen::::setLazyComponentRegistrator:::");

      lazyScreen = screens[componentName];
      if (lazyScreen) {
        if (!lazyScreen.screen) {
          lazyScreen.screen = getRequireByKey(componentName);
        }

        if (lazyScreen.isModal) {
          registerModalComponent(componentName, lazyScreen.screen);
        } else {
          registerComponent(
            componentName,
            lazyScreen.screen,
            lazyScreen.option
          );
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const registerComponent = (
  routeName,
  Screen,
  defaultProps = {},
  isModalScreen = false
) => {
  Navigation.registerComponent(routeName, () => <Screen {...defaultProps} />);
};

const registerModalComponent = (routeName, Screen, defaultProps = {}) => {
  registerComponent(routeName, Screen, defaultProps, true);
};

//#endregion ------------------------------------------------------------------------------------------------

const onAppLaunched = () => {
  console.log("onAppLaunched:::");
  loadInitialStatus();
};

Navigation.events().registerAppLaunchedListener(onAppLaunched);
