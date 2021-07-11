// import { screens } from "container/constant/screen";
import { screens, modals } from "../constant/screen";
import { Navigation } from "react-native-navigation";
import { color } from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import { Platform, Dimensions, PixelRatio, Vibration } from "react-native";
import DeviceInfo from "react-native-device-info";
import { getIntl } from "../utils/common";

global.currentScreen = [];

const osVersion = DeviceInfo.getSystemVersion();
const version = parseInt(osVersion);

let bottomTabsByID = {};

const NAVIGATION_SCREENS = [
  screens.TAB_NAVIGATE,
  screens.TAB_TASK,
  screens.TAB_NOTIFICATION,
  screens.TAB_ACCOUNT,
];

bottomTabsByID[screens.TAB_ACCOUNT] = (passProps) => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_ACCOUNT,
          id: screens.TAB_ACCOUNT,
          options: {
            layout: {
              componentBackgroundColor: "#fff",
              orientation: ["portrait"],
            },
          },
          passProps,
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
        // text: getIntl().formatMessage(Messages.tab_account),
        icon: require("container/asset/icon/more.png"),
        selectedIcon: require("container/asset/icon/more_select.png"),
        testID: screens.TAB_ACCOUNT,
      },
    },
  },
});

bottomTabsByID[screens.TAB_NAVIGATE] = (passProps) => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_NAVIGATE,
          id: screens.TAB_NAVIGATE,
          options: {
            layout: {
              componentBackgroundColor: color.background,
              orientation: ["portrait"],
            },
          },
          passProps,
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
        // text: getIntl().formatMessage(Messages.tab_navigate),
        icon: require("container/asset/icon/navigate.png"),
        selectedIcon: require("container/asset/icon/navigate_select.png"),
        testID: screens.TAB_NAVIGATE,
      },
    },
  },
});

bottomTabsByID[screens.TAB_NOTIFICATION] = (passProps) => ({
  stack: {
    children: [
      {
        component: {
          name: screens.TAB_NOTIFICATION,
          id: screens.TAB_NOTIFICATION,
          options: {
            layout: {
              componentBackgroundColor: "#fff",
              orientation: ["portrait"],
            },
          },
          passProps,
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
        // text: getIntl().formatMessage(Messages.tab_notification),
        icon: require("container/asset/icon/notification.png"),
        selectedIcon: require("container/asset/icon/notification_select.png"),
        testID: screens.TAB_NOTIFICATION,
      },
    },
  },
});

bottomTabsByID[screens.TAB_TASK] = (passProps) => {
  console.log("screens.TAB_TASK:::", passProps);

  return {
    stack: {
      children: [
        {
          component: {
            name: screens.TAB_TASK,
            id: screens.TAB_TASK,
            options: {
              layout: {
                componentBackgroundColor: "#fff",
                orientation: ["portrait"],
              },
            },
            passProps,
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
          // text: getIntl().formatMessage(Messages.tab_task),
          icon: require("container/asset/icon/task.png"),
          selectedIcon: require("container/asset/icon/task_select.png"),
          testID: screens.TAB_TASK,
        },
      },
    },
  };
};

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

const navigationHomeTab = async (passProps = {}, screenIndex = 0) => {
  const defaultTabs = [
    bottomTabsByID[screens.TAB_NAVIGATE](passProps),
    bottomTabsByID[screens.TAB_TASK](passProps),
    bottomTabsByID[screens.TAB_NOTIFICATION](passProps),
    bottomTabsByID[screens.TAB_ACCOUNT](passProps),
  ];

  console.log("navigationHomeTab:::", screenIndex, passProps, defaultTabs);

  await Navigation.setRoot({
    root: {
      bottomTabs: {
        id: screens.HOME,
        options: {
          layout: {
            orientation: ["portrait"],
          },
          bottomTabs: {
            currentTabIndex: screenIndex,
            tabsAttachMode:
              Platform.OS === "ios" && version <= 10
                ? "onSwitchToTab"
                : "onSwitchToTab",
            backgroundColor: "#fff",
          },
        },
        children: defaultTabs,
      },
    },
  });
};

const displayModal = (screen, config = {}) => {
  console.log("displayModal:::", screen, config);

  const topBar =
    config.options && config.options.topBar ? config.options.topBar : {};

  const statusBar =
    config.options && config.options.statusBar ? config.options.statusBar : {};

  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            id: screen,
            name: screen,
            passProps: config,
            options: {
              layout: {
                backgroundColor: "transparent",
                screenBackgroundColor: "transparent",
                componentBackgroundColor: "transparent",
                orientation: ["portrait"],
              },
              modalPresentationStyle: Platform.select({
                ios: "overCurrentContext",
                android: version >= 9 ? "overCurrentContext" : "none",
              }),
              screenBackgroundColor: "transparent",
              animations: {
                showModal: {
                  enabled: Platform.select({ ios: true, android: true }),
                  ...Platform.select({
                    android: {
                      alpha: {
                        from: 0,
                        to: 1,
                        duration: 100,
                        startDelay: 0,
                        // interpolation: "accelerate",
                      },
                    },
                    ios: {
                      alpha: {
                        from: 0,
                        to: 1,
                        duration: 100,
                        startDelay: 0,
                        interpolation: "accelerate",
                      },
                    },
                  }),
                },
                dismissModal: {
                  enabled: Platform.select({ ios: true, android: true }),
                  ...Platform.select({
                    android: {
                      alpha: {
                        from: 1,
                        to: 0,
                        duration: 100,
                        startDelay: 0,
                        // interpolation: "accelerate",
                      },
                    },
                    ios: {
                      alpha: {
                        from: 1,
                        to: 0,
                        duration: 100,
                        startDelay: 0,
                        // interpolation: "accelerate",
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

const gotoScreenNavigate = (screen, index, passProps) => {
  Navigation.mergeOptions(screens.HOME, {
    bottomTabs: {
      currentTabIndex: index,
    },
  });
  Navigation.updateProps(screen, passProps);
};

export const gotoRoute = (screen, config = {}, isModal = false) => {
  console.log("gotoRoute::::", screen, config);

  const currentScreen = global.currentScreen;

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
    } else if (NAVIGATION_SCREENS.find((i) => i == screen)) {
      const screenNavigate = NAVIGATION_SCREENS.find((i) => i == screen);
      const screenIndex = NAVIGATION_SCREENS.findIndex((i) => i == screen);
      gotoScreenNavigate(screenNavigate, screenIndex, config);
    } else {
      if (isModal) {
        displayModal(screen, config);
      } else {
        let componentId =
          config.componentId ||
          (currentScreen.length &&
            currentScreen[currentScreen.length - 1].componentId);
        Navigation.push(componentId, {
          component: {
            name: screen,
            id: screen,
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
                componentBackgroundColor: color.backgroundColor,
                backgroundColor: "#fff",
                screenBackgroundColor: "#fff",
                orientation: ["portrait"],
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
                visible: true,
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
  global.currentScreen.push({ componentId, componentName, passProps });
};

export const back = () => {
  console.log("back::::::");

  if (currentScreen && currentScreen.length) {
    if (modals[currentScreen[currentScreen.length - 1].componentName]) {
      Navigation.dismissModal(
        currentScreen[currentScreen.length - 1].componentId
      );
    } else {
      Navigation.pop(currentScreen[currentScreen.length - 1].componentId);
    }
    global.currentScreen.pop();
  }
};

export const showSpinner = () => {
  console.log("showSpinner");
  Navigation.showOverlay({
    component: {
      name: modals.SPINNER,
      id: modals.SPINNER,
      options: {
        overlay: {
          interceptTouchOutside: true,
          zIndex: 9999999,
        },
        layout: { componentBackgroundColor: "transparent" },
      },
      passProps: {
        show: true,
      },
    },
  });
};

export const hideSpinner = () => {
  console.log("hideSpinner");
  Navigation.dismissOverlay(modals.SPINNER);
};

export const showModal = (passProps) => {
  gotoRoute(modals.GENERAL_MODAL, passProps, true);
};
