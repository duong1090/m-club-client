// import auth from "@react-native-firebase/auth";
import firebase from "../config/firebase.config";

const { auth } = firebase;

export const verifyPhoneNumber = (phone) => {
  return new Promise((resolve, reject) => {
    auth()
      .verifyPhoneNumber(`+84${phone}`, false, false)
      .then((res) => {
        resolve(res.verificationId);
      })
      .catch((err) => reject(err));
  });
};

export const confirmCode = async (verificationId, code) => {
  const credential = auth.PhoneAuthProvider.credential(verificationId, code);
  return auth()
    .signInWithCredential(credential)
    .then(() => Promise.resolve(true))
    .catch((err) => Promise.reject(err));
};

export const getIdToken = () => {
  return new Promise((resolve, reject) => {
    auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        resolve(idToken);
      })
      .catch((err) => reject(err));
  });
};
