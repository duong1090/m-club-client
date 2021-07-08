import { API_TOKEN } from "container/constant/storage";
import { gotoLogin, gotoHome } from "container/utils/router";
import { setIntl } from "container/utils/common";
import { checkPlayServicesAdvanced, getOrganization, logOut } from "./user";
import { getNumberOfNotification } from "./application";
import { ORGANIZATION, LANG } from "container/constant/storage";
import { setItem, getItem } from "container/utils/storage";
import { Navigation } from "react-native-navigation";
import { screens } from "../constant/screen";
import OneSignal from "react-native-onesignal"; // Import package from node modules

const TAG_ONE_SIGNAL = [
  "id",
  "club_id",
  "department_id",
  "position_id",
  "is_root",
  "phone",
  "identification",
  "sex",
  "lang",
];

export const loadInitialStatus = async () => {
  //check Google Play Services
  checkPlayServicesAdvanced();

  const apiToken = await getItem(API_TOKEN);
  if (apiToken) {
    //loading organization when app start
    try {
      const org = await getOrganization();
      if (org) {
        global.organization = org;
        setItem(ORGANIZATION, JSON.stringify(org));
        //register onesignal tab
        if (org.member && org.club) {
          const tags = TAG_ONE_SIGNAL.reduce((obj, tag) => {
            obj[tag] = org.member[tag];
            return obj;
          }, {});

          OneSignal.sendTags(tags);
        }
        //set language
        if (org.member && org.member.lang) {
          setItem(LANG, org.member.lang);
          setIntl(org.member.lang);
          global.lang = org.member.lang;
        } else {
          const tempLang = await getItem(LANG);
          setIntl(tempLang);
          global.lang = tempLang;
        }
      } else {
        const tempOrg = await getItem(ORGANIZATION);
        const tempLang = await getItem(LANG);
        if (tempOrg) global.organization = JSON.parse(tempOrg);
        if (tempLang) global.lang = tempLang;
      }

      await gotoHome();

      const notiNumber = await getNumberOfNotification();
      //merge unread notification number
      if (notiNumber) {
        Navigation.mergeOptions(screens.TAB_NOTIFICATION, {
          bottomTab: {
            ...{ badge: notiNumber ? `${notiNumber}` : null },
          },
        });
      }
    } catch (err) {
      logOut();
    }
  } else gotoLogin();
};
