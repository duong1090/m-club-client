// import auth from "@react-native-firebase/auth";
import firebase from "../config/firebase.config";

const { auth } = firebase;

export const verifyPhoneNumber = (phone) => {
  console.log("verifyPhoneNumber::::", phone);
  return new Promise((resolve, reject) => {
    // auth()
    //   .verifyPhoneNumber(`+84${phone}`, false, false)
    //   .then((res) => {
    //     resolve(res.verificationId);
    //   })
    //   .catch((err) => reject(err));

    auth()
      .verifyPhoneNumber(`+84${phone}`, false, false)
      .on(
        "state_changed",
        (phoneAuthSnapshot) => {
          console.log("phoneAuthSnapshot::::", phoneAuthSnapshot);
          switch (phoneAuthSnapshot.state) {
            case firebase.auth.PhoneAuthState.CODE_SENT:
              console.log("code sent", phoneAuthSnapshot);
              resolve(phoneAuthSnapshot.verificationId);
              break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log("verification error", phoneAuthSnapshot);
              console.log(phoneAuthSnapshot.error);
              reject(phoneAuthSnapshot.error);
              break;
            default:
              reject("error");
          }
        }
        // (phoneAuthSnapshot) => {
        //   // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
        //   // depending on the platform. If you've already handled those cases in the observer then
        //   // there's absolutely no need to handle it here.

        //   // Platform specific logic:
        //   // - if this is on IOS then phoneAuthSnapshot.code will always be null
        //   // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
        //   //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
        //   // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
        //   //   continue with user input logic.
        //   console.log("phoneAuthSnapshot", phoneAuthSnapshot);
        // }
      );
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
