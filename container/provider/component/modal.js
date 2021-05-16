import React, { useRef } from "react";
import ModalContext from "container/context/modal";
import GeneralModal from "container/component/ui/generalModal";
import Spinner from "container/component/ui/spinner";

const ModalProvider = (props) => {
  const modalRef = useRef(null);
  const spinnerRef = useRef(null);

  const showActionSheet = (options) => {
    modalRef.current && modalRef.current.show({ type: "actionSheet", options });
  };

  const showSpinner = () => {
    spinnerRef.current && spinnerRef.current.show();
  };

  const hideSpinner = () => {
    spinnerRef.current && spinnerRef.current.hide();
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
      <GeneralModal ref={modalRef} />
      <Spinner ref={spinnerRef} />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
