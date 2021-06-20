import React, { useEffect, useRef } from "react";
import ModalContext from "container/context/modal";
import {
  back,
  gotoRoute,
  showSpinner as showLoading,
  hideSpinner as hideLoading,
} from "../../utils/router";
import { modals } from "../../constant/screen";
import { BackHandler } from "react-native";

const ModalProvider = (props) => {
  const showActionSheet = (options) => {
    gotoRoute(modals.GENERAL_MODAL, { options, type: "actionSheet" }, true);
  };

  const showSpinner = () => {
    showLoading();
  };

  const hideSpinner = () => {
    hideLoading();
  };

  const showConfirmModal = (options) => {
    gotoRoute(modals.GENERAL_MODAL, { options, type: "confirm" }, true);
  };

  const showErrorModal = (options) => {
    gotoRoute(modals.GENERAL_MODAL, { options, type: "error" }, true);
  };

  const getContext = () => {
    return {
      showActionSheet,
      showConfirmModal,
      showErrorModal,
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
