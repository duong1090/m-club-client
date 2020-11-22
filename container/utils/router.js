// import { screens } from "container/constant/screen";
import screens from "../constant/screen";
import { Navigation } from "react-native-navigation";
import { color } from "container/variables/common";
import { FormattedMessage } from "react-intl";
import Messages from "container/translation/Message";
import { Platform, Dimensions, PixelRatio, Vibration } from "react-native";
import DeviceInfo from "react-native-device-info";
import { getIntl } from "../utils/common";

let currentScreen = null;

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
            topBar: {
              visible: true,
              leftButtonColor: color.topBarButtonColor,
              rightButtonColor: color.topBarButtonColor,
              rightButtons: [],
              title: {
                text: getIntl().formatMessage(Messages.tab_account),
                alignment: "fill",
              },
              backButton: {
                color: color.topBarButtonColor,
              },
              background: {
                color: color.topBarBgColor,
                translucent: true,
                blur: false,
              },
            },
          },
        },
      },
    ],
    options: {
      topBar: {
        background: {
          color: color.topBarBgColor,
          translucent: true,
          blur: false,
        },
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_account),
        // icon: require('@src/assets/icons/Tab_acc_in.png'),
        // selectedIcon: require('@src/assets/icons/Tab_acc_act.png'),
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
            topBar: {
              visible: true,
              leftButtonColor: color.topBarButtonColor,
              rightButtonColor: color.topBarButtonColor,
              rightButtons: [],
              title: {
                text: getIntl().formatMessage(Messages.tab_navigate),
                alignment: "fill",
              },
              backButton: {
                color: color.topBarButtonColor,
              },
              background: {
                color: color.topBarBgColor,
                translucent: true,
                blur: false,
              },
            },
          },
        },
      },
    ],
    options: {
      topBar: {
        background: {
          color: color.topBarBgColor,
          translucent: true,
          blur: false,
        },
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_navigate),
        // icon: require('@src/assets/icons/Tab_acc_in.png'),
        // selectedIcon: require('@src/assets/icons/Tab_acc_act.png'),
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
            topBar: {
              visible: true,
              leftButtonColor: color.topBarButtonColor,
              rightButtonColor: color.topBarButtonColor,
              rightButtons: [],
              title: {
                text: getIntl().formatMessage(Messages.tab_notification),
                alignment: "fill",
              },
              backButton: {
                color: color.topBarButtonColor,
              },
              background: {
                color: color.topBarBgColor,
                translucent: true,
                blur: false,
              },
            },
          },
        },
      },
    ],
    options: {
      topBar: {
        background: {
          color: color.topBarBgColor,
          translucent: true,
          blur: false,
        },
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_notification),
        // icon: require('@src/assets/icons/Tab_acc_in.png'),
        // selectedIcon: require('@src/assets/icons/Tab_acc_act.png'),
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
            topBar: {
              visible: true,
              leftButtonColor: color.topBarButtonColor,
              rightButtonColor: color.topBarButtonColor,
              rightButtons: [],
              title: {
                text: getIntl().formatMessage(Messages.tab_task),
                alignment: "fill",
              },
              backButton: {
                color: color.topBarButtonColor,
              },
              background: {
                color: color.topBarBgColor,
                translucent: true,
                blur: false,
              },
            },
          },
        },
      },
    ],
    options: {
      topBar: {
        background: {
          color: color.topBarBgColor,
          translucent: true,
          blur: false,
        },
      },
      bottomTabs: {
        titleDisplayMode: "alwaysShow",
      },
      bottomTab: {
        text: getIntl().formatMessage(Messages.tab_task),
        // icon: require('@src/assets/icons/Tab_acc_in.png'),
        // selectedIcon: require('@src/assets/icons/Tab_acc_act.png'),
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

const navigationHomeTab = () => {
  const defaultTabs = [
    bottomTabsByID[screens.TAB_NAVIGATE](),
    bottomTabsByID[screens.TAB_TASK](),
    bottomTabsByID[screens.TAB_NOTIFICATION](),
    bottomTabsByID[screens.TAB_ACCOUNT](),
  ];

  Navigation.setRoot({
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
};

const showModal = (screen, config = {}) => {
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

export const gotoRoute = (screen, config = {}) => {
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
      if (screens[screen].isModal) {
        showModal(screen, config);
      } else {
        let componentId = config.componentId || currentScreen.componentId;
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
                  color: color.background,
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
  currentScreen = { componentId, componentName, passProps };
};

export const back = () => {
  if (currentScreen && screens[currentScreen.componentId].isModal) {
    Navigation.dismissModal(currentScreen.componentId);
  } else {
    Navigation.pop(currentScreen.componentId);
  }
};
