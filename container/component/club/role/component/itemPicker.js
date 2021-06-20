import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { Icon } from "native-base";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  
} from "container/variables/common";
import { currItemState, currTypeState, currTabState } from "../recoil";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import EmptyData from "container/component/ui/emptyData";
import Avatar from "container/component/ui/avatar";

const ItemPicker = (props) => {
  //props
  const { intl } = props;

  //state
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  let page = 1;

  //recoil
  const setCurrItem = useSetRecoilState(currItemState);
  const currType = useRecoilValue(currTypeState);
  const setCurrTab = useSetRecoilState(currTabState);

  //hooks --------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (currType) getData();
  }, [currType]);

  //function -----------------------------------------------------------------------------------------------
  const getData = () => {
    const params = {
      page,
    };

    const api = {
      department: "department/get",
      position: "position/get",
      member: "member/get",
    }[currType];

    getRequest(api, params)
      .then((res) => {
        if (res && res.data && res.data.items) {
          if (page > 1) {
            let temp = [...data];
            temp.concat(res.data.items);
            setData(temp);
          } else {
            let temp = res.data.items;
            setData(temp);
          }
          setMeta(res.data.meta);
        }
      })
      .catch((err) => console.error(err));
  };

  const loadMore = () => {
    if (meta.total_page && page < meta.total_page) {
      page++;
      getData();
    }
  };

  const onChangeTab = (tab) => {
    setCurrTab(tab);
  };

  const selectItem = (item) => {
    onChangeTab("role_list");
    setCurrItem(item);
  };

  //render -------------------------------------------------------------------------------------------------

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => selectItem(item)}
        style={styles.itemBox(index)}
      >
        <View style={styles.headerItem}>
          {currType == "member" ? (
            <Avatar data={item} size={scale(80)} noShadow style={styles.avatarItem} />
          ) : null}
          <Text style={styles.textItem}>{item.name}</Text>
        </View>
        <Icon
          name="chevron-right"
          type="FontAwesome5"
          style={styles.iconItem}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.actionBox}>
        <TouchableOpacity
          onPress={() => onChangeTab("type_list")}
          style={styles.backButton}
        >
          <Icon
            name="chevron-left"
            type="FontAwesome5"
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>
            {intl.formatMessage(Messages.select_group)}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderItem(item, index)}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyData />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconItem: {
    
    fontSize: scale(50),
    color: color.green,
  },

  itemBox: (index) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    ...shadow,
    paddingHorizontal: space.bgPadding,
    paddingVertical: space.itemMargin,
    borderRadius: space.border,
    marginHorizontal: space.componentMargin,
    marginBottom: space.itemMargin,
    marginTop: index == 0 ? space.itemMargin : 0,
  }),
  iconItem: {
    fontSize: scale(30),
    color: color.grey,
  },

  textItem: {
    
  },

  avatarItem: {
    marginRight: scale(20),
  },

  headerItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: space.componentMargin / 2,
    paddingVertical: scale(20),
  },
  actionIcon: {
    fontSize: scale(20),
    marginRight: scale(5),
    color: "#fff",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: color.grey,
  },
  actionText: {
    
    fontSize: fontSize.size26,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: scale(5),
  },
});

export default injectIntl(ItemPicker);
