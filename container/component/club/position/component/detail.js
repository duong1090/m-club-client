import React, { useContext, useEffect } from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { View, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { scale, color, defaultText } from "container/variables/common";
import { Icon } from "native-base";
import SimpleDetail from "container/component/ui/simpleDetail";
import { currPositionState, listPositionState } from "../recoil";
import ModalContext from 'container/context/modal';
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import Toast from "react-native-simple-toast";
import { normalRole } from "container/constant/role";

const PositionDetail = (props) => {
  //props
  const { intl, changeMode } = props;

  //recoil
  const [data, setData] = useRecoilState(currPositionState);
  const [list, setList] = useRecoilState(listPositionState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //#region effect
  useEffect(() => {
    if (props.data) setData(props.data);
  }, [props.data]);
  //#endregion

  //function
  const gotoList = () => {
    changeMode && changeMode("list");
  };

  const gotoEdit = () => {
    changeMode && changeMode("edit");
  };

  const onDelete = () => {
    showSpinner();

    let params = {};
    if (data && data.id) params.id = data.id;
    postRequest("position/delete", params)
      .then((res) => {
        if (res && res.data) {
          deleteSuccess();
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const deleteSuccess = () => {
    Toast.show(intl.formatMessage(Messages.delete_success), Toast.SHORT);
    //update list
    let temp = [...list];
    let index = tempList.findIndex((item) => item.id == data.id);
    temp.splice(index, 1);
    setList(temp);
  };

  //render
  return (
    <View style={styles.container}>
      <SimpleDetail
        data={data}
        iconHeader={
          <Icon
            type="FontAwesome5"
            name="user-tag"
            style={{
              ...defaultText,
              fontSize: scale(50),
              color: color.inverse,
            }}
          />
        }
        backButton={{
          title: intl.formatMessage(Messages.list),
          onPress: () => gotoList(),
        }}
        updateButton={{
          title: intl.formatMessage(Messages.edit),
          onPress: () => gotoEdit(),
        }}
        onDelete={() => onDelete()}
        privilege={{
          delete: normalRole.POS_DELETE,
          update: normalRole.POS_UPDATE,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {},
  avatarBox: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
  },
  avatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    resizeMode: "contain",
  },
  iconBox: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: color.backgroundColor,
    width: scale(50),
    width: scale(50),
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default injectIntl(PositionDetail);
