import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";
import { setIntl } from "container/utils/common";
import { getOrganization, logOut } from "../action/user";
import { ORGANIZATION, LANG } from "../constant/storage";
import { setItem, getItem } from "../utils/storage";

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);

  if (apiToken) {
    //loading organization when app start
    try {
      const org = await getOrganization();
      if (org) {
        global.organization = org;
        setItem(ORGANIZATION, JSON.stringify(org));
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
      gotoHome();
    } catch (err) {
      logOut();
    }
  } else gotoLogin();
};

