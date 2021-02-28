import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";
import { setIntl } from "container/utils/common";
import { getOrganization, logOut } from "../action/user";
import { getNumberOfNotification } from "../action/application";
import { ORGANIZATION, LANG } from "../constant/storage";
import { setItem, getItem } from "../utils/storage";
import { Navigation } from "react-native-navigation";
import { screens } from "../constant/screen";
import OneSignal from "react-native-onesignal"; // Import package from node modules


export const loadInitialStatus = async () => {
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
          OneSignal.sendTags({
            mem_id: org.member.id,
            club_id: org.club.id,
          });
        }
        //set language
        if (org.lang) {
          setItem(LANG, org.lang);
          global.lang = org.lang;
        } else {
          const tempLang = await getItem(LANG);
          console.log("loadInitialStatus:::", tempLang);
          if (tempLang) global.lang = tempLang;
          else global.lang = "en";
        }
      } else {
        const tempOrg = await getItem(ORGANIZATION);
        const tempLang = await getItem(LANG);
        if (tempOrg) global.organization = JSON.parse(tempOrg);
        if (tempLang) global.lang = tempLang;
      }

      await setIntl();
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
