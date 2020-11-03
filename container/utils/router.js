import { screens } from "container/constant/screen";
import { Navigation } from "react-native-navigation";

export const gotoLogin = (options = {}) => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screens.LOGIN.value,
              options: {
                topBar: {
                  visible: false,
                },
                ...options,
              },
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    },
  });
};

export const gotoSignup = (options = {}) => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screens.SIGNUP.value,
              options: {
                topBar: {
                  visible: false,
                },
                ...options,
              },
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    },
  });
};

export const gotoHome = (option = {}) => {
  
};