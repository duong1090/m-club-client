import React, { useState, useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";
import {
  listDepartmentState,
  currDepartmentState,
} from "container/recoil/state/club/department";
import Messages from "container/translation/Message";
import { View } from "react-native";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { Navigation } from "react-native-navigation";
import { showSpinner, hideSpinner, back } from "container/utils/router";
import Toast from "react-native-simple-toast";
import SimpleRecord from "container/component/ui/simpleRecord";

const DEFAULT_INFO = {
  name: "",
};

const DepartmentRecord = (props) => {
  //props
  const { mode, intl, componentId } = props;
  //state
  const [info, setInfo] = useState(DEFAULT_INFO);

  //recoil
  const [data, setData] = useRecoilState(currDepartmentState);
  const [list, setList] = useRecoilState(listDepartmentState);

  console.log("DepartmentRecord:::", list, data);

  //#region effect
  useEffect(() => {
    if (props.data) setData(props.data);
  }, [props.data]);

  //#endregion

  //constant
  const fields = [
    {
      name: <FormattedMessage {...Messages.name} />,
      fieldName: "name",
      required: true,
      placeholder: intl.formatMessage(Messages.name_placeholder),
      onChangeText: (value) => onChangeField("name", value),
    },
  ];

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.department),
      },
    },
  });

  //#region function - event
  const onChangeField = (fieldName, value) => {
    let temp = { ...info };
    temp[fieldName] = value;
    setInfo(temp);
  };

  const onSubmit = () => {
    switch (mode) {
      case "create":
        create();
        break;
      case "update":
        update();
        break;
    }
  };

  const create = () => {
    showSpinner();
    postRequest(Config.API_URL.concat("department/create"), info)
      .then((res) => {
        if (res && res.data) createSuccess(res.data);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.err(err);
        Toast.show(intl.formatMessage(Messages.create_fail), Toast.SHORT);
      });
  };

  const createSuccess = (data) => {
    Toast.show(intl.formatMessage(Messages.create_success), Toast.SHORT);
    //update list
    let tempList = [...list];
    tempList.push(transform(data));
    setList(tempList);
    console.log("createSuccess:::", tempList);
    // back();
  };

  const transform = (data) => {
    let temp = { ...data };
    temp.description = data.description || "";
    return temp;
  };

  const update = () => {
    let params = { ...info };

    if (data && data.id) params.id = data.id;
    showSpinner();

    postRequest(Config.API_URL.concat("department/update"), params)
      .then((res) => {
        if (res && res.data) updateSuccess();
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.err(err);
        Toast.show(intl.formatMessage(Messages.update_fail), Toast.SHORT);
      });
  };

  const updateSuccess = (data) => {
    Toast.show(intl.formatMessage(Messages.update_success), Toast.SHORT);
    //update curr
    setData(data);
    //update list
    let tempList = [...list];
    let index = tempList.indexOf((item) => item.id == data.id);
    tempList[index] = transform(data);
    setList(tempList);
    back();
  };

  //#endregion

  //render
  return (
    <View>
      <SimpleRecord
        mode={mode}
        data={data}
        fields={fields}
        onSubmit={() => onSubmit()}
      />
    </View>
  );
};

export default injectIntl(DepartmentRecord);
