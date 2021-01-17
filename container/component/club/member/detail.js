import React, { useState, useEffect } from "react";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { View, Text, StyleSheet } from "react-native";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import {
  listMemberState,
  currMemberState,
} from "container/recoil/state/club/member";
import { useRecoilState } from "recoil";
import SimpleDetail from "container/component/ui/simpleDetail";
import { showSpinner, hideSpinner } from "container/utils/router";
import { SEX } from "container/constant/element";
import Avatar from "container/component/ui/avatar";
import {
  color,
  scale,
  defaultText,
  space,
  fontSize,
} from "container/variables/common";

const MemberDetail = (props) => {
  //props
  const { intl, data, changeMode } = props;
  //state
  const [isGetData, setIsGetData] = useState(true);

  //recoil
  const [info, setInfo] = useRecoilState(currMemberState);
  const [list, setList] = useRecoilState(listMemberState);

  //effect
  useEffect(() => {
    if (info && info.id && isGetData) getDetail();
  }, [info]);

  //function - event
  const getDetail = () => {
    console.log("getDetail:::", info);
    showSpinner();
    let params = { id: info.id };
    getRequest(Config.API_URL.concat("member/detail"), params)
      .then((res) => {
        if (res && res.data) {
          setInfo(transform(res.data));
        }
        setIsGetData(false);
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        setIsGetData(false);
        hideSpinner();
      });
  };

  const gotoList = () => {
    changeMode && changeMode("list");
  };

  const gotoEdit = () => {
    changeMode && changeMode("edit");
  };

  const transform = (data) => {
    let temp = { ...data };
    temp.title = temp.name;
    temp.description = data.description || "";
    return temp;
  };

  // const onDelete = () => {
  //   showSpinner();

  //   let params = {};
  //   if (info && info.id) params.id = info.id;
  //   postRequest(Config.API_URL.concat("member/delete"), params)
  //     .then((res) => {
  //       if (res && res.data) {
  //         deleteSuccess();
  //       }
  //       hideSpinner();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       hideSpinner();
  //     });
  // };

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
        data={info}
        iconHeader={<Avatar data={info} size={scale(50)} />}
        header={(value) => (
          <View style={styles.header}>
            <Avatar data={info} size={scale(200)} />
            <Text style={styles.title}>{value.name}</Text>
          </View>
        )}
        contentItems={[
          {
            title: intl.formatMessage(Messages.phone),
            value: info && info.phone ? info.phone : "",
          },
          {
            title: intl.formatMessage(Messages.address),
            value: info && info.address ? info.address : "",
          },
          {
            title: intl.formatMessage(Messages.sex),
            value: info && info.sex ? SEX[info.sex].title : SEX[2].title,
          },
          {
            title: intl.formatMessage(Messages.birthday),
            value: info && info.birthday ? info.birthday : "",
          },
          {
            title: intl.formatMessage(Messages.department),
            value:
              info && info.department && info.department.name
                ? info.department.name
                : "",
          },
          {
            title: intl.formatMessage(Messages.position),
            value:
              info && info.position && info.position.name
                ? info.position.name
                : "",
          },
        ]}
        backButton={{
          title: intl.formatMessage(Messages.list),
          onPress: () => gotoList(),
        }}
        updateButton={{
          title: intl.formatMessage(Messages.edit),
          onPress: () => gotoEdit(),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: space.bgPadding,
    marginBottom: space.componentMargin,
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
    backgroundColor: color.light,
  },
  title: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    marginTop: space.itemMargin,
  },
});

export default injectIntl(MemberDetail);
