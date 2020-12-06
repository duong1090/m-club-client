import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import IntlMainProvider from "./intlProvider";
import { LogBox } from "react-native";

const MainProvider = (props) => {
  const { children } = props;

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <RecoilRoot>
      <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
