import React, { useRef } from "react";
import ModalContext from "container/context/modal";
import GeneralModal from "container/component/ui/generalModal";

const ModalProvider = (props) => {
  const modalRef = useRef(null);

  const showActionSheet = (options) => {
    modalRef.current && modalRef.current.show({ type: "actionSheet", options });
  };

  const getContext = () => {
    return {
      showActionSheet,
    };
  };

  return (
    <ModalContext.Provider value={getContext()}>
      {props.children}
      <GeneralModal ref={modalRef} />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
