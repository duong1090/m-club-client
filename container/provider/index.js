import React, { useEffect, useState } from "react";
import {
  RecoilRoot,
  useRecoilTransactionObserver_UNSTABLE,
  useSetRecoilState,
} from "recoil";
import AsyncStorage from "@react-native-community/async-storage";
import { setItem, getAllItem } from "container/utils/storage";
import IntlMainProvider from "./intlProvider";
import rootAtom from "../recoil/state";

import { LogBox } from "react-native";

const PersistenceObserver = () => {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    for (const modifiedAtom of snapshot.getNodes_UNSTABLE({
      isModified: true,
    })) {
      const atomLoadable = snapshot.getLoadable(modifiedAtom);
      console.log(
        "PersistenceObserver::::",
        modifiedAtom.key,
        atomLoadable.contents
      );
      if (atomLoadable.state === "hasValue") {
        setItem(
          modifiedAtom.key,
          JSON.stringify({ value: atomLoadable.contents })
        );
      }
    }
  });
  return null;
};

const MainProvider = (props) => {
  const { children } = props;

  //disable warning box
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  //initial state for atom - using update atom when persisting
  // const initializeState = async ({ set }) => {
  //   const localItems = await getAllItem();
  //   localItems.map((item) => {
  //     set(rootAtom[item.key], JSON.parse(item.value).value);
  //   });
  // };

  return (
    <RecoilRoot>
      {/* <PersistenceObserver /> */}
      <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
