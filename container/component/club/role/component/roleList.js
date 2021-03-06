import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currItemState, currTypeState, currTabState } from "../recoil";
import { getRequest, postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import CheckBox from "@react-native-community/checkbox";
import update from "immutability-helper";
import { normalRole } from "container/constant/role";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import ModalContext from "container/context/modal";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  
} from "container/variables/common";
import { DEFAULT_TYPE } from "./typeList";
import { Icon } from "native-base";
import EmptyData from "container/component/ui/emptyData";
import Avatar from "container/component/ui/avatar";
import PrivilegeContext from "container/context/privilege";
import { isLoginUser } from "container/utils/user";

const RoleList = (props) => {
  //props
  const { intl } = props;

  //state
  const [data, setData] = useState([]);
  const [backUpData, setBackUpData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  //recoil
  const currItem = useRecoilValue(currItemState);
  const currType = useRecoilValue(currTypeState);
  const setCurrTab = useSetRecoilState(currTabState);

  //variables
  const didMount = useRef(false);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);
  const privilegeContext = useContext(PrivilegeContext);

  //hooks ---------------------------------------------------------------------------------
  useEffect(() => {
    getData();
  }, [currItem]);

  useEffect(() => {
    if (didMount.current) updateData();
  }, [data]);

  useEffect(() => {
    onSelectAll();
  }, [selectAll]);

  //function ------------------------------------------------------------------------------

  const getData = () => {
    const params = {};
    if (currType) params.type = currType;
    if (currItem.id) params.target_id = currItem.id;

    showSpinner();
    getRequest("role/get", params)
      .then((res) => {
        if (res && res.data != null) {
          getDataSuccess(res.data);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const getDataSuccess = (data) => {
    const { role_keys } = data;

    let finalData = [];

    Object.keys(normalRole).map((key) => {
      let itemRole = normalRole[key];

      //check role from server
      if ((role_keys && role_keys[key]) || data == "") itemRole.checked = true;
      else itemRole.checked = false;
      finalData.push(itemRole);
    });

    setData(finalData);
    setBackUpData(finalData);
    didMount.current = true;
  };

  const updateData = () => {
    const role_keys = data
      .filter((item) => item.checked)
      .map((item) => item.value);

    const params = {
      role_keys,
    };
    if (currType) params.type = currType;
    if (currItem.id) params.target_id = currItem.id;

    postRequest("role/update", params)
      .then((res) => {
        if (res && res.data) {
          if (currType == "member" && isLoginUser(currItem)) {
            privilegeContext.updateRoles(res.data.role_keys);
          }
        } else {
          setData(backUpData);
        }
      })
      .then((err) => {
        console.error(err);
      });
  };

  const onCheckRole = async (index) => {
    const checked = data[index] && data[index].checked ? true : false;
    setData(update(data, { [index]: { checked: { $set: !checked } } }));
  };

  const onChangeTab = (tab) => {
    setCurrTab(tab);
    didMount.current = false;
  };

  const onSelectAll = () => {
    const temp = data.map((item) => {
      let tempItem = { ...item };
      tempItem.checked = selectAll;
      return tempItem;
    });
    setData(temp);
  };

  //render --------------------------------------------------------------------------------

  const renderItem = (item, index) => {
    return (
      <View style={styles.itemBox(index)}>
        <CheckBox
          disabled={false}
          value={item.checked ? true : false}
          tintColors={{ true: color.done }}
          onChange={() => onCheckRole(index)}
          boxType="square"
          lineWidth={1}
          style={{ width: scale(40), height: scale(40) }}
        />
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const renderHeader = () => {
    const icon = DEFAULT_TYPE.find((item) => item.value == currType).icon;

    return (
      <View style={styles.headerBox}>
        <View style={styles.rightHeader}>
          {currType == "member" ? (
            <Avatar
              data={currItem}
              size={scale(80)}
              style={styles.avatarItem}
            />
          ) : null}
          <Text style={styles.textHeader}>
            {currItem.name ? currItem.name : ""}
          </Text>
        </View>

        <Icon name={icon.name} type={icon.type} style={styles.iconHeader} />
      </View>
    );
  };

  const renderAction = () => {
    return (
      <View style={styles.actionBox}>
        <TouchableOpacity
          onPress={() => onChangeTab("item_pick")}
          style={styles.backButton}
        >
          <Icon
            name="chevron-left"
            type="FontAwesome5"
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>
            {intl.formatMessage(Messages.select_title, {
              title: intl.formatMessage(Messages[currType]).toLowerCase(),
            })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTool = () => {
    return (
      <View style={styles.toolBox}>
        <CheckBox
          disabled={false}
          value={selectAll}
          boxType="square"
          lineWidth={1}
          style={{ width: scale(40), height: scale(40) }}
          tintColors={{ true: color.done }}
          onChange={() => setSelectAll(!selectAll)}
        />
        <Text style={styles.textTool}>
          {intl.formatMessage(Messages.select_title, {
            title: intl.formatMessage(Messages.all).toLowerCase(),
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderAction()}
      {renderHeader()}
      {renderTool()}
      <FlatList
        contentContainerStyle={styles.listBox}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderItem(item, index)}
        ListEmptyComponent={<EmptyData />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listBox: {
    paddingBottom: space.bgPadding,
  },

  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: space.bgPadding,
    ...shadow,
  },

  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarItem: {
    marginRight: scale(20),
  },

  toolBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: scale(2),
    borderColor: color.lightGrey,
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    ...shadow,
  },

  textTool: {
    
    color: color.fontColor,
    marginLeft: scale(10),
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

  textItem: {
    
  },
  iconHeader: {
    fontSize: scale(30),
    color: color.background,
  },
  textHeader: {
    
    fontWeight: "bold",
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

export default injectIntl(RoleList);
