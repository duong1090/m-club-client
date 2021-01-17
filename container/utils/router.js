// import { screens } from "container/constant/screen";
import { screens, modals } from "../constant/screen";
import { Navigation } from "react-native-navigation";
import { color } from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import { Platform, Dimensions, PixelRatio, Vibration } from "react-native";
import DeviceInfo from "react-native-device-info";
import { getIntl } from "../utils/common";
import { getUserInfo } from "../action/application";

global.currentScreen = [];

const osVersion = DeviceInfo.getSystemVersion();
const version = parseInt(osVersion);

let bottomTabsByID = {};

bottomTabsByID[screens.TAB_ACCOUNT] = () => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_ACCOUNT,
          id: screens.TAB_ACCOUNT,
          options: {
            layout: { backgroundColor: "#fff" },
          },
        },
      },
    ],
    options: {
      topBar: {
        visible: false,
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_account),
        icon: require("container/asset/icon/more.png"),
        selectedIcon: require("container/asset/icon/more_select.png"),
        testID: screens.TAB_ACCOUNT,
      },
    },
  },
});

bottomTabsByID[screens.TAB_NAVIGATE] = () => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_NAVIGATE,
          id: screens.TAB_NAVIGATE,
          options: {
            layout: { backgroundColor: "#fff" },
          },
        },
      },
    ],
    options: {
      topBar: {
        visible: false,
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_navigate),
        icon: require("container/asset/icon/navitage.png"),
        selectedIcon: require("container/asset/icon/navitage_select.png"),
        testID: screens.TAB_NAVIGATE,
      },
    },
  },
});

bottomTabsByID[screens.TAB_NOTIFICATION] = () => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_NOTIFICATION,
          id: screens.TAB_NOTIFICATION,
          options: {
            layout: { backgroundColor: "#fff" },
          },
        },
      },
    ],
    options: {
      topBar: {
        visible: false,
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_notification),
        icon: require("container/asset/icon/notification.png"),
        selectedIcon: require("container/asset/icon/notification_select.png"),
        testID: screens.TAB_NOTIFICATION,
      },
    },
  },
});

bottomTabsByID[screens.TAB_TASK] = () => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_TASK,
          id: screens.TAB_TASK,
          options: {
            layout: { backgroundColor: "#fff" },
          },
        },
      },
    ],
    options: {
      topBar: {
        visible: false,
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_task),
        icon: require("container/asset/icon/task.png"),
        selectedIcon: require("container/asset/icon/task_select.png"),
        testID: screens.TAB_TASK,
      },
    },
  },
});

export const gotoLogin = (options = {}) => {
  console.log("gotoLogin:::");
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screens.LOGIN,
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

export const gotoHome = (params = {}) => {
  gotoRoute(screens.HOME, params);

};

const navigationHomeTab = async () => {
  const defaultTabs = [
    bottomTabsByID[screens.TAB_NAVIGATE](),
    bottomTabsByID[screens.TAB_TASK](),
    bottomTabsByID[screens.TAB_NOTIFICATION](),
    bottomTabsByID[screens.TAB_ACCOUNT](),
  ];

  await Navigation.setRoot({
    root: {
      bottomTabs: {
        id: screens.HOME,
        options: {
          layout: {
            orientation: ["portrait"],
          },
          bottomTabs: {
            currentTabIndex: 0,
            tabsAttachMode:
              Platform.OS === "ios" && version <= 10
                ? "together"
                : "onSwitchToTab",
          },
        },
        children: defaultTabs,
      },
    },
  });

  await getUserInfo();
};

const showModal = (screen, config = {}) => {
  console.log("showModal:::", config);

  const topBar =
    config.options && config.options.topBar ? config.options.topBar : {};

  const statusBar =
    config.options && config.options.statusBar ? config.options.statusBar : {};

  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: screen,
            passProps: config,
            options: {
              layout: {
                backgroundColor: "transparent",
                screenBackgroundColor: "transparent",
              },
              modalPresentationStyle: Platform.select({
                ios: "overCurrentContext",
                android: version >= 9 ? "overCurrentContext" : "none",
              }),
              screenBackgroundColor: "transparent",
              animations: {
                showModal: {
                  enabled: Platform.select({ ios: false, android: true }),
                  ...Platform.select({
                    android: {
                      alpha: {
                        from: 0,
                        to: 1,
                        duration: 200,
                        startDelay: 0,
                        interpolation: "accelerate",
                      },
                    },
                    ios: {
                      content: {
                        alpha: {
                          from: 0,
                          to: 1,
                          duration: 200,
                          startDelay: 0,
                          interpolation: "accelerate",
                        },
                      },
                    },
                  }),
                },
                dismissModal: {
                  enabled: Platform.select({ ios: false, android: true }),
                  ...Platform.select({
                    android: {
                      alpha: {
                        from: 1,
                        to: 0,
                        duration: 200,
                        startDelay: 0,
                        interpolation: "accelerate",
                      },
                    },
                  }),
                },
              },
              topBar: {
                ...topBar,
                title: {
                  alignment: "center",
                },
              },
              statusBar: {
                ...statusBar,
              },
            },
          },
        },
      ],
      options: {
        topBar: {
          visible: false,
          ...topBar,
        },
        statusBar: {
          ...statusBar,
        },
      },
    },
  });
};

export const gotoRoute = (screen, config = {}, isModal = false) => {
  if (!config) config = {};
  try {
    const topBar =
      config.options && config.options.topBar ? config.options.topBar : {};
    const statusBar =
      config.options && config.options.statusBar
        ? config.options.statusBar
        : {};
    const title = topBar.title;
    const background = topBar.background;
    const backButton = topBar.backButton;

    if (screen == screens.HOME) {
      navigationHomeTab(config);
    } else {
      if (isModal) {
        showModal(screen, config);
      } else {
        let componentId =
          config.componentId ||
          (currentScreen.length &&
            currentScreen[currentScreen.length - 1].componentId);
        Navigation.push(componentId, {
          component: {
            name: screen,
            passProps: {
              ...config,
            },
            options: {
              statusBar: {
                style: "light",
                backgroundColor: color.topBarButtonColor,
                ...statusBar,
              },
              layout: {
                componentBackgroundColor: "#fff",
                backgroundColor: "#fff",
                screenBackgroundColor: "#fff",
              },
              animations: {
                push: {
                  enabled: true,
                },
                pop: {},
              },
              bottomTabs: {
                height: 0,
                visible: false,
              },
              topBar: {
                animate: true,
                leftButtonColor: color.topBarButtonColor,
                rightButtonColor: color.topBarButtonColor,
                background: {
                  color: color.topBarBgColor,
                  translucent: true,
                  ...background,
                },
                backButton: {
                  color: color.topBarButtonColor,
                },
                ...topBar,
                title: {
                  ...title,
                  color: color.topBarTextColor,
                  alignment: "center",
                },
                backButton: {
                  showTitle: false,
                  color: color.topBarButtonColor,
                  ...backButton,
                },
              },
            },
          },
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const setCurrentScreen = (componentId, componentName, passProps) => {
  currentScreen.push({ componentId, componentName, passProps });
};

export const back = () => {
  if (currentScreen && currentScreen.length) {
    if (modals[currentScreen[currentScreen.length - 1].componentName]) {
      Navigation.dismissModal(
        currentScreen[currentScreen.length - 1].componentId
      );
    } else {
      Navigation.pop(currentScreen[currentScreen.length - 1].componentId);
    }
    currentScreen.pop();
  }
};

export const showSpinner = () => {
  Navigation.showOverlay({
    component: {
      name: screens.SPINNER,
      id: screens.SPINNER,
      options: {
        overlay: {
          interceptTouchOutside: true,
        },
      },
      passProps: {
        show: true,
      },
    },
  });
};

export const hideSpinner = () => {
  Navigation.dismissOverlay(screens.SPINNER);
};
