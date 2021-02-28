// import auth from "@react-native-firebase/auth";
import firebase from "../config/firebase.config";

const { auth } = firebase;

export const signInWithPhoneNumber = (phone) => {
  console.log("signInWithPhoneNumber::::", phone);
  return new Promise((resolve, reject) => {
    auth()
      .signInWithPhoneNumber(`+84${phone}`)
      .then((confirmResult) => {
        console.log("signInWithPhoneNumber:::", confirmResult);
        resolve(confirmResult);
      })
      .catch((error) => reject(error));
  });
};

export const getIdToken = () => {
  return new Promise((resolve, reject) => {
    auth().currentUser
      .getIdToken()
      .then((idToken) => {
        resolve(idToken);
      })
      .catch((err) => reject(err));
  });
};
