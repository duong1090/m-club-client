import { getItem } from "container/utils/storage";
import { API_TOKEN, IS_FIRST_TIME } from "container/constant/storage";
import { gotoLogin, gotoSignup } from "container/utils/router";

export const loadInitialStatus = async () => {
  const apiToken = await getItem(API_TOKEN);
  console.log("loadInitialStatus:::", apiToken);
  // const apiToken = false;
  if (apiToken) {
    //case 1: User logged in. go to HOME
  } else {
    const isFirstTime = await getItem(IS_FIRST_TIME);
    console.log("loadInitialStatus:::nonApi", isFirstTime);

    // const isFirstTime = true;
    if (isFirstTime) {
      //case 2: User haven't logged in, haven't account, goto SIGNUP
      gotoSignup();
    } else {
      //case 3: User haven't logged in, already have account, goto LOGIN
      gotoLogin();
    }
  }
};
