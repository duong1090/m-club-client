import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  listMemberState,
  currMemberState,
} from "container/recoil/state/club/member";
import { View } from "react-native";
import { Icon } from "native-base";
import { scale, defaultText } from "container/variables/common";
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import SimpleList from "container/component/ui/simpleList";
import Avatar from "container/component/ui/avatar";

const MemberList = (props) => {
  //props
  const { changeMode } = props;
  //state
  // const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const page = 1;

  //recoil
  const [data, setData] = useRecoilState(listMemberState);
  const setCurrMember = useSetRecoilState(currMemberState);

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
    console.log("onPressItem:::", item);
    setCurrMember(item);
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

  const getList = (page = 1) => {
    setLoading(true);
    getRequest(Config.API_URL.concat("member/get"), { page })
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
        iconHeader={(item) => <Avatar data={item} size={scale(80)} />}
        addNewItem={gotoRecord}
        styleTextItem={{ fontWeight: "bold" }}
        onPressItem={(item) => onPressItem(item)}
        iconItem={
          <Icon
            type="FontAwesome5"
            name="user"
            style={{ ...defaultText, fontSize: scale(30) }}
          />
        }
        loadMore={loadMore}
      />
    </View>
  );
};

export default MemberList;
