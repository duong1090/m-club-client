import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import IntlMainProvider from "./intlProvider";
import PrivilegeProvider from "./privilegeProvider";
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

  console.log("MainProvider::::", global);

  const [rolesState, setRoleState] = useState({
    roles: member && member.roles ? member.roles : {},
    updateRoles: (newRoles) => setRoleState({ ...rolesState, roles: newRoles }),
    isRoot: member && member.is_root ? true : false,
  });

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
        <ActionSheetProvider>
          <IntlMainProvider>{React.Children.only(children)}</IntlMainProvider>
        </ActionSheetProvider>
      </PrivilegeProvider>
    </RecoilRoot>
  );
};

export default MainProvider;
