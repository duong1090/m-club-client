import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  listDepartmentState,
  currDepartmentState,
} from "container/recoil/state/club/department";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { View } from "react-native";
import { Icon } from "native-base";
import { scale, defaultText } from "container/variables/common";
import screens from "container/constant/screen";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { Navigation } from "react-native-navigation";
import { gotoRoute } from "container/utils/router";
import SimpleList from "container/component/ui/simpleList";

const DepartmentList = (props) => {
  //props
  const { intl, componentId } = props;
  //state
  // const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const page = 1;

  //recoil
  const [data, setData] = useRecoilState(listDepartmentState);
  const setCurrDepartment = useSetRecoilState(currDepartmentState);

  console.log("DepartmentList:::", data);

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      title: {
        text: intl.formatMessage(Messages.department),
      },
    },
  });

  //#region effect
  // useEffect(() => {
  //   getList();
  // }, []);

  //#endregion

  //#region function - event
  const gotoRecord = (mode = "create") => {
    gotoRoute(screens.DEPARTMENT_RECORD, { mode });
  };

  const onPressItem = (item) => {
    // gotoRoute(screens.DEPARTMENT_DETAIL);
    // setCurrDepartment(item);
  };

  const transform = (data) => {
    let temp = [...data];
    temp.map((item) => {
      item.name = data.name;
      item.description = data.description || "";
      return item;
    });
    return temp;
  };

  const getList = (page = 1) => {
    getRequest(Config.API_URL.concat("department/get"), { page })
      .then((res) => {
        if (res && res.data && res.data.items) {
          if (page > 1) {
            let temp = [...data];
            temp.concat(transform(res.data.items));
            setData(temp);
          } else {
            let temp = transform(res.data.items);
            setData(temp);
          }
          setMeta(res.data.meta);
          setLoading(false);
        }
      })
      .then((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const loadMore = () => {
    if (meta.total_page && page < meta.total_page) {
      page++;
      getList(page);
    }
  };

  //#endregion

  //render
  return (
    <View>
      <SimpleList
        loading={loading}
        data={data}
        addNewItem={gotoRecord}
        styleTextItem={{ fontWeight: "bold" }}
        onPressItem={(item) => onPressItem(item)}
        iconItem={
          <Icon name="people" style={{ ...defaultText, fontSize: scale(30) }} />
        }
        loadMore={loadMore}
      />
    </View>
  );
};

export default injectIntl(DepartmentList);
