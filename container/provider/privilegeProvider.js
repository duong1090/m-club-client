import React from "react";
import PrivilegeContext from "container/context/privilege";

const PrivilegeProvider = (props) => {
  return (
    <PrivilegeContext.Provider value={props.value}>
      {props.children}
    </PrivilegeContext.Provider>
  );
};

export default PrivilegeProvider;
