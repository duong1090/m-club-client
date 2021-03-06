import React, { useState, useEffect, useContext } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";
import { listMemberState, currMemberState, currModeState } from "../recoil";
import Messages from "container/translation/Message";
import { View } from "react-native";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import ModalContext from "container/context/modal";
import Toast from "react-native-simple-toast";
import SimpleRecord from "container/component/ui/simpleRecord";
import { gotoRoute } from "container/utils/router";
import { modals } from "container/constant/screen";
import { SEX } from "container/constant/element";
import moment from "moment";
import { getIntl } from "container/utils/common";

const DEFAULT_INFO = {
  name: null,
  phone: null,
  address: null,
  email: null,
  sex: null,
  birthday: moment().format(getIntl().formatMessage(Messages.date_format)),
  department: null,
  position: null,
  identification: null,
};

const MemberRecord = (props) => {
  //props
  const { intl } = props;
  //state
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [currMode, setCurrMode] = useRecoilState(currModeState);

  //recoil
  const [data, setData] = useRecoilState(currMemberState);
  const [list, setList] = useRecoilState(listMemberState);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //#region effect
  useEffect(() => {
    if (props.data) setData(props.data);
  }, [props.data]);

  useEffect(() => {
    if (data) setInfo(data);
  }, [data]);

  useEffect(() => {
    if (currMode == "create") setInfo(DEFAULT_INFO);
    else if (currMode == "edit") setInfo(data);
  }, [currMode]);

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
      name: <FormattedMessage {...Messages.student_id} />,
      fieldName: "identification",
      placeholder: intl.formatMessage(Messages.student_id_placeholder),
      onChangeText: (value) => onChangeField("identification", value),
    },
    {
      name: <FormattedMessage {...Messages.phone} />,
      fieldName: "phone",
      placeholder: intl.formatMessage(Messages.phone_placeholder),
      onChangeText: (value) => onChangeField("phone", value),
      keyboardType: "numeric",
    },
    {
      name: <FormattedMessage {...Messages.address} />,
      fieldName: "address",
      placeholder: intl.formatMessage(Messages.address_placeholder),
      onChangeText: (value) => onChangeField("address", value),
    },
    {
      name: <FormattedMessage {...Messages.sex} />,
      fieldName: "sex",
      type: "button",
      placeholder: intl.formatMessage(Messages.sex_placeholder),
      modalObj: {
        externalData: SEX,
        selectedData: info.sex,
        onDone: (value) => onChangeField("sex", value),
      },
    },
    {
      name: <FormattedMessage {...Messages.birthday} />,
      fieldName: "birthday",
      type: "date_picker",
      mode: "date",
      placeholder: intl.formatMessage(Messages.birthday_placeholder),
      onChangeDate: (value) => {
        console.log("onChangeDate:::", value);
        let temp = moment(value).format(
          intl.formatMessage(Messages.date_format)
        );
        onChangeField("birthday", temp);
      },
    },
    {
      name: <FormattedMessage {...Messages.department} />,
      fieldName: "department",
      type: "button",
      placeholder: intl.formatMessage(Messages.department_placeholder),
      modalObj: {
        api: "department/get",
        params: {},
        selectedData: info.department,
        onDone: (value) => onChangeField("department", value),
      },
    },
    {
      name: <FormattedMessage {...Messages.position} />,
      fieldName: "position",
      type: "button",
      placeholder: intl.formatMessage(Messages.position_placeholder),
      modalObj: {
        api: "position/get",
        params: {},
        selectedData: info.position,
        onDone: (value) => onChangeField("position", value),
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
    switch (currMode) {
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
    if (currMode == "edit" && data && data.id) params.id = data.id;
    if (info.name) params.name = info.name;
    if (info.phone) params.phone = info.phone;
    if (info.address) params.address = info.address;
    if (info.email) params.email = info.email;
    if (info.sex && info.sex.id) params.sex = info.sex.id;
    if (info.birthday) params.birthday = info.birthday;
    if (info.department && info.department.id)
      params.department_id = info.department.id;
    if (info.position && info.position.id)
      params.position_id = info.position.id;
    if (info.identification && info.identification != "")
      params.identification = info.identification;

    return params;
  };

  const create = () => {
    showSpinner();
    const params = prepareParams();
    postRequest("member/create", params)
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
    setCurrMode("list");
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
    postRequest("member/update", params)
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
        mode={currMode}
        data={info}
        fields={fields}
        onSubmit={() => onSubmit()}
        backButton={{
          title: intl.formatMessage(Messages.list),
          onPress: () => setCurrMode("list"),
        }}
      />
    </View>
  );
};

export default injectIntl(MemberRecord);
