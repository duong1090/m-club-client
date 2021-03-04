import React from "react";
import PrivilegeContext from "container/context/privilege";

const PrivilegeAction = (props) => {
  //props
  const { privilegeKey, children } = props;

  //render
  return (
    <PrivilegeContext.Consumer>
      {(checkKeys) => {
        if (checkKeys[privilegeKey])
          return <React.Fragment>{children}</React.Fragment>;
        else return null;
      }}
    </PrivilegeContext.Consumer>
  );
};

export default PrivilegeAction;
