import React from "react";
import { RecoilRoot } from "recoil";
import IntlMainProvider from "./intlProvider";

const MainProvider = (props) => {
  const { children } = props;

  return (
    <RecoilRoot>
      <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
