import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FlatList,
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { styles, AVATAR_SIZE } from "../style/list";
import { gotoRoute } from "container/utils/router";
import Avatar from "container/component/ui/avatar";
import ModalContext from "container/context/modal";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { getHumanDay } from "container/helper/time";
import { highlighText } from "container/helper/format";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { PRIORITY_LEVEL } from "container/constant/element";
import update from "immutability-helper";
import { Navigation } from "react-native-navigation";
import { screens } from "container/constant/screen";
import EmptyData from "container/component/ui/emptyData";
import CreateNotification from "./create";
import PrivilegeAction from "container/component/ui/privilegeAction";
import { normalRole } from "container/constant/role";
import ActionButton from "container/component/ui/actionButton";
import { Icon } from "native-base";
import { getNumberOfNotification } from "container/action/application";
import Detail from "./detail";

const NotificationList = (props) => {
  //props
  const { intl } = props;
  //state
  const [meta, setMeta] = useState({});
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //variables
  let page = 1;
  const createRef = useRef(null);
  const detailRef = useRef(null);

  //effect -----------------------------------------------------------------------------------------------
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("useEffect:::", props);

    if (props.mode == "detail" && props.data)
      detailRef.current && detailRef.current.show(props.data);
  }, [props.mode]);

  //function - event -------------------------------------------------------------------------------------
  const getData = () => {
    showSpinner();

    getRequest("notification/get", { page })
      .then((res) => {
        if (res && res.data) {
          if (page > 1) setData(data.concat(res.data.items));
          else setData(res.data.items);
          setMeta(res.data.meta);
        }
        hideSpinner();
        setRefresh(false);
      })
      .catch((err) => {
        console.error(err);
        setRefresh(false);
        hideSpinner();
      });
  };

  const loadMore = () => {
    console.log("loadMore:::", page, meta);
    if (page < meta.total_page) {
      page++;
      getData();
    }
  };

  const onPressItem = (item, index) => {
    console.log("onPressItem::", item);

    if (!item.is_read) doRead(item, index);

    if (item.target_route == screens.TAB_NOTIFICATION)
      detailRef.current && detailRef.current.show(item);
    else
      gotoRoute(item.target_route, {
        data: { id: item.source_id ? item.source_id : null },
        mode: item.source_id ? "detail" : "list",
      });
  };

  const doRead = (item, index) => {
    postRequest("notification/read", {
      id: item.id,
    })
      .then((res) => {
        if (res) {
          //merge unread notification number
          console.log("doRead::::", global.numberOfNotification);
          Navigation.mergeOptions(screens.TAB_NOTIFICATION, {
            bottomTab: {
              ...{
                badge: global.numberOfNotification
                  ? `${--global.numberOfNotification}`
                  : null,
              },
            },
          });
          setData(
            update(data, {
              [index]: { is_read: { $set: res.data ? true : false } },
            })
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRefresh = () => {
    setRefresh(true);
    getData();
    getNumberOfNotification();
  };

  const openCreateNotification = () => {
    createRef && createRef.current.show();
  };

  //render -----------------------------------------------------------------------------------------------
  const renderHeader = () => {
    return (
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>
          {intl.formatMessage(Messages.tab_notification)}
        </Text>
      </View>
    );
  };

  const renderIconType = () => {
    return require("container/asset/icon/task_noti.png");
  };

  const replaceText = (type) => {
    switch (type) {
      case "task":
        return PRIORITY_LEVEL.map((item) => ({
          text: intl.formatMessage(Messages[item.name]),
        }));
    }
  };

  const renderItem = (item, index) => {
    const formatTime = getHumanDay(
      item.time_push,
      intl.formatMessage(Messages.datetime_format)
    );

    const highlightContent = highlighText(
      item.content,
      item.objects,
      styles.content,
      replaceText(item.noti_type)
    );

    return (
      <TouchableOpacity
        onPress={() => onPressItem(item, index)}
        underlayColor="red"
      >
        <View style={styles.item(item.is_read)}>
          <View style={styles.avatarBox}>
            <Avatar
              noShadow
              size={AVATAR_SIZE}
              data={{
                id: item.implement_user,
                name: item.implement_name ? item.implement_name : null,
              }}
            />
            <View
              style={styles.avatarIconBox("task", {
                noti_color: item.noti_color,
              })}
            >
              <ImageBackground
                style={styles.avatarIconBackground}
                source={require("container/asset/icon/bgr_grandient.png")}
              >
                <Image
                  style={styles.avatarIconImage}
                  source={renderIconType()}
                />
              </ImageBackground>
            </View>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.content} numberOfLines={3}>
              {highlightContent}
            </Text>
            <Text style={styles.timeText}>{formatTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderItem(item, index)}
        onEndReachedThreshold={0.8}
        onEndReached={loadMore}
        refreshing={refresh}
        onRefresh={handleRefresh}
        ListEmptyComponent={<EmptyData />}
        ListHeaderComponent={renderHeader()}
      />
      <PrivilegeAction privilegeKey={normalRole.NOTI_CREATE}>
        <ActionButton
          title={intl.formatMessage(Messages.add)}
          style={styles.actionButtonBox}
          icon={
            <Icon name="plus" type="Entypo" style={styles.actionButtonIcon} />
          }
          onPress={() => openCreateNotification()}
        />
        <CreateNotification ref={createRef} />
      </PrivilegeAction>
      <Detail intl={intl} ref={detailRef} />
    </View>
  );
};

export default injectIntl(NotificationList);
