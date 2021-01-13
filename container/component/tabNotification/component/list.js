import React, { useState, useEffect } from "react";
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
import { showSpinner, hideSpinner } from "container/utils/router";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { getHumanDay } from "container/helper/time";
import { highlighText } from "container/helper/format";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { PRIORITY_LEVEL } from "container/constant/element";
import update from "immutability-helper";

const NotificationList = (props) => {
  //props
  const { intl } = props;
  //state
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [refresh, setRefresh] = useState(false);

  //variables
  let page = 1;

  //effect -----------------------------------------------------------------------------------------------
  useEffect(() => {
    showSpinner();
    getData();
  }, []);

  //function - event -------------------------------------------------------------------------------------
  const getData = () => {
    getRequest(Config.API_URL.concat("notification/get"), { page })
      .then((res) => {
        if (res && res.data) {
          setData(res.data.items);
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
    if (page < meta.total_pages) {
      page++;
      getData();
    }
  };

  const onPressItem = (item, index) => {
    console.log("onPressItem::", item);

    doRead(item, index);
    gotoRoute(item.target_route, {
      data: { id: item.source_id },
      mode: "detail",
    });
  };

  const doRead = (item, index) => {
    postRequest(Config.API_URL.concat("notification/read"), {
      id: item.id,
    })
      .then((res) => {
        if (res) {
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

  const renderEmpty = () => {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          {intl.formatMessage(Messages.empty_data)}
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
            <Avatar size={AVATAR_SIZE} data={{ id: item.implement_user }} />
            <View style={styles.avatarIconBox("task", { prior_level: 0 })}>
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderItem(item, index)}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        refreshing={refresh}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmpty()}
        ListHeaderComponent={renderHeader()}
      />
    </View>
  );
};

export default injectIntl(NotificationList);
