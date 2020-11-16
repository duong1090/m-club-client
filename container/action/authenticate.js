import auth from "@react-native-firebase/auth";

export const signInWithPhoneNumber = (phone) => {
  console.log("signInWithPhoneNumber:::");

  return new Promise((resolve, reject) => {
    auth()
      .signInWithPhoneNumber(`+84${"911674849"}`)
      .then((confirmResult) => {
        console.log("signInWithPhoneNumber:::", confirmResult);
        resolve(confirmResult);
      })
      .catch((error) => reject(error));
  });
};

export const doActiveUser = () => {
  return new Promise((resolve, reject) => {
    auth.currentUser
      .getIdToken()
      .then((idToken) => {
        resolve(idToken);
      })
      .catch((err) => reject(err));
  });
};
