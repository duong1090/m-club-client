import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import IntlMainProvider from "./component/intl";
import PrivilegeProvider from "./component/privilege";
import ModalProvider from "./component/modal";

import { BackHandler, LogBox, Text } from "react-native";
import { defaultText } from "../variables/common";

const MainProvider = (props) => {
  const { children } = props;
  const { member } = global.organization || {};

  const [rolesState, setRoleState] = useState({
    roles: member && member.roles ? member.roles : {},
    updateRoles: (newRoles) => setRoleState({ ...rolesState, roles: newRoles }),
    isRoot: member && member.is_root ? true : false,
  });

  const setDefaultStyle = () => {
    let oldRender = Text.render;
    Text.render = (...args) => {
      let origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [defaultText, origin.props.style],
      });
    };
  };

  useEffect(() => {
    //disable warning box
    LogBox.ignoreAllLogs();

    setDefaultStyle();
  }, []);

  return (
    <RecoilRoot>
      <PrivilegeProvider value={rolesState}>
        <ModalProvider>
          <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
        </ModalProvider>
      </PrivilegeProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
