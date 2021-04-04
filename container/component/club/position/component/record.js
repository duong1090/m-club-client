import React, { useState, useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";
import { currPositionState, listPositionState } from "../recoil";
import Messages from "container/translation/Message";
import { View } from "react-native";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { showSpinner, hideSpinner } from "container/utils/router";
import Toast from "react-native-simple-toast";
import SimpleRecord from "container/component/ui/simpleRecord";

const DEFAULT_INFO = {
  name: "",
  department: null,
};

const PositionRecord = (props) => {
  //props
  const { mode, intl, changeMode } = props;
  //state
  const [info, setInfo] = useState(DEFAULT_INFO);

  //recoil
  const [data, setData] = useRecoilState(currPositionState);
  const [list, setList] = useRecoilState(listPositionState);

  //#region effect
  useEffect(() => {
    if (props.data) {
      setData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (data) setInfo(data);
  }, [data]);

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
    {
      name: <FormattedMessage {...Messages.department} />,
      fieldName: "department",
      placeholder: intl.formatMessage(Messages.department_placeholder),
      type: "button",
      modalObj: {
        key: "department",
        api: "department/get",
        params: {},
        selectedData: info.department,
        onDone: (value) => onChangeField("department", value),
      },
    },
  ];

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
      case "edit":
        update();
        break;
    }
  };

  const prepareParams = () => {
    let params = {};
    if (mode == "edit" && data.id) params.id = data.id;
    if (info.name) params.name = info.name;
    if (info.department) params.department_id = info.department.id;
    return params;
  };

  const create = () => {
    showSpinner();
    const params = prepareParams();
    postRequest(Config.API_URL.concat("position/create"), params)
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
    changeMode("list");
  };

  const transform = (data) => {
    let temp = { ...data };
    temp.title = temp.name;
    temp.description = data.description || "";
    return temp;
  };

  const update = () => {
    showSpinner();
    const params = prepareParams();
    postRequest(Config.API_URL.concat("position/update"), params)
      .then((res) => {
        if (res && res.data) updateSuccess(res.data);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        console.error(err);
        Toast.show(intl.formatMessage(Messages.update_fail), Toast.SHORT);
      });
  };

  const updateSuccess = (data) => {
    Toast.show(intl.formatMessage(Messages.update_success), Toast.SHORT);
    //update curr
    setData(data);
    //update list
    let tempList = [...list];
    let index = tempList.findIndex((item) => item.id == data.id);
    tempList[index] = transform(data);
    setList(tempList);
  };

  //#endregion

  //render
  return (
    <View>
      <SimpleRecord
        mode={mode}
        data={info}
        fields={fields}
        onSubmit={() => onSubmit()}
        backButton={{
          title: intl.formatMessage(Messages.list),
          onPress: () => changeMode("list"),
        }}
      />
    </View>
  );
};

export default injectIntl(PositionRecord);
