import React, { useState, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listDepartmentState, currDepartmentState } from "../recoil";
import { View } from "react-native";
import { Icon } from "native-base";
import { scale, defaultText } from "container/variables/common";
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import SimpleList from "container/component/ui/simpleList";
import debounce from "lodash/debounce";
import { normalRole } from "container/constant/role";

const DepartmentList = (props) => {
  //props
  const { changeMode } = props;
  //state
  // const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  let page = 1;

  //recoil
  const [data, setData] = useRecoilState(listDepartmentState);
  const setCurrDepartment = useSetRecoilState(currDepartmentState);

  //variables
  const debounceSearch = useRef(debounce((text) => onSearch(text), 200))
    .current;

  //#region effect
  useEffect(() => {
    getList();
  }, []);

  //#endregion

  console.log();

  //#region function - event
  const gotoRecord = (mode = "create") => {
    // gotoRoute(screens.DEPARTMENT_EDIT, { mode });
    changeMode && changeMode(mode);
  };

  const onPressItem = (item) => {
    setCurrDepartment(item);
    changeMode && changeMode("detail");
  };

  const transform = (data) => {
    let temp = JSON.parse(JSON.stringify(data));
    temp.map((item, index) => {
      item.title = data[index].name;
      return item;
    });
    return temp;
  };

  const getList = (extraParams = {}) => {
    let params = { ...extraParams, page };
    setLoading(true);
    getRequest("department/get", params)
      .then((res) => {
        if (res && res.data && res.data.items) {
          console.log("getList:::", res.data);
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
      getList();
    }
  };

  const onSearch = (text) => {
    let params = {};
    if (text != "") params.name = text;
    getList(params);
  };

  //#endregion

  //render
  return (
    <View>
      <SimpleList
        onSearch={(text) => debounceSearch(text)}
        loading={loading}
        data={data}
        addNewItem={gotoRecord}
        styleTextItem={{ fontWeight: "bold" }}
        onPressItem={(item) => onPressItem(item)}
        iconItem={
          <Icon name="people" style={{ ...defaultText, fontSize: scale(30) }} />
        }
        loadMore={loadMore}
        privilege={{
          create: normalRole.DEPT_CREATE,
        }}
      />
    </View>
  );
};

export default DepartmentList;
