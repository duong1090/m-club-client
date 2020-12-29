import React, { useEffect } from "react";
import { View } from "react-native";
import { getOrganization } from "container/action/user";
import { useSetRecoilState } from "recoil";
import { userState } from "container/recoil/state/user";

const TabNavigate = (props) => {
  const setUser = useSetRecoilState(userState);

  // useEffect(() => {
  //   getOrganization().then((res) => {
  //     if (res && res.data) {
  //       setUser(res.data);
  //     }
  //   });
  // }, []);

  return <View />;
};

export default TabNavigate;
