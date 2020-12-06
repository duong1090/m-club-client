import { getItem } from "container/utils/storage";
import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";
import { setIntl } from "container/utils/common";

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);
  console.log("loadInitialStatus:::", apiToken);
  await setIntl();
  if (apiToken) {
    gotoHome();
  } else {
    gotoLogin();
    // gotoHome();
  }
};
