import { getItem } from "container/utils/storage";
import { API_TOKEN, IS_RECENT_TIME } from "container/constant/storage";
import { gotoLogin, gotoHome, gotoRoute } from "container/utils/router";

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);
  console.log("loadInitialStatus:::", apiToken);
  // const apiToken = false;
  if (apiToken) {
    //case 1: User logged in. go to HOME
    gotoHome();
  } else {
    gotoLogin();
  }
};
