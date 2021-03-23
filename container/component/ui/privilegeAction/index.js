import React from "react";
import PrivilegeContext from "container/context/privilege";

const PrivilegeAction = (props) => {
  //props
  const { privilegeKey, children } = props;

  //render
  return (
    <PrivilegeContext.Consumer>
      {(privilege) => {
        const { roles, isRoot } = privilege;

        if (
          (privilegeKey.value == "is_root" && isRoot) ||
          roles[privilegeKey.value]
        )
          return <React.Fragment>{children}</React.Fragment>;
        else return null;
      }}
    </PrivilegeContext.Consumer>
  );
};

export default PrivilegeAction;
