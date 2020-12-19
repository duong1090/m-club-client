import { getItem } from "container/utils/storage";
import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";
import { setIntl } from "container/utils/common";
import { getOrganization } from "../action/user";
import { ORGANIZATION } from "../constant/storage";
import { setItem } from "../utils/storage";

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);

  //set intl for multi language
  await setIntl();
  if (apiToken) {
    gotoHome();
    //loading organization when app start
    const org = await getOrganization();
    if (org) {
      global.organization = org;
      setItem(ORGANIZATION, org);
    } else {
      const temp = await getItem(ORGANIZATION);
      if (temp) global.organization = temp;
    }
  } else gotoLogin();
};
