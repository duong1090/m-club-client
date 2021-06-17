import React, { useRef } from "react";
import ModalContext from "container/context/modal";
import {
  back,
  gotoRoute,
  showSpinner as showLoading,
  hideSpinner as hideLoading,
} from "../../utils/router";
import { modals } from "../../constant/screen";
import { Navigation } from "react-native-navigation";

const ModalProvider = (props) => {
  const showActionSheet = (options) => {
    console.log("showActionSheet:::", options);

    gotoRoute(modals.GENERAL_MODAL, { options, type: "actionSheet" }, true);
  };

  const showSpinner = () => {
    console.log("showSpinnerNe::::");
    // gotoRoute(modals.SPINNER, {}, true);
    showLoading();
  };

  const hideSpinner = () => {
    console.log("hideSpinnerNe::::");

    // Navigation.dismissModal(modals.SPINNER);
    hideLoading();
  };

  const getContext = () => {
    return {
      showActionSheet,
      showSpinner,
      hideSpinner,
    };
  };

  return (
    <ModalContext.Provider value={getContext()}>
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
