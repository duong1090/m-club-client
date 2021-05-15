import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import IntlMainProvider from "./component/intl";
import PrivilegeProvider from "./component/privilege";
import ModalProvider from "./component/modal";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { LogBox } from "react-native";

// const PersistenceObserver = () => {
//   useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
//     for (const modifiedAtom of snapshot.getNodes_UNSTABLE({
//       isModified: true,
//     })) {
//       const atomLoadable = snapshot.getLoadable(modifiedAtom);
//       console.log(
//         "PersistenceObserver::::",
//         modifiedAtom.key,
//         atomLoadable.contents
//       );
//       if (atomLoadable.state === "hasValue") {
//         setItem(
//           modifiedAtom.key,
//           JSON.stringify({ value: atomLoadable.contents })
//         );
//       }
//     }
//   });
//   return null;
// };

const MainProvider = (props) => {
  const { children } = props;
  const { member } = global.organization || {};

  const [rolesState, setRoleState] = useState({
    roles: member && member.roles ? member.roles : {},
    updateRoles: (newRoles) => setRoleState({ ...rolesState, roles: newRoles }),
    isRoot: member && member.is_root ? true : false,
  });

  console.log("MainProvider::::", global, rolesState);

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
      <PrivilegeProvider value={rolesState}>
        <ModalProvider>
          <ActionSheetProvider>
            <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
          </ActionSheetProvider>
        </ModalProvider>
      </PrivilegeProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
