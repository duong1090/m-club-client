import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "native-base";
import { Container } from "native-base";
import Spinner from "container/component/ui/spinner";
import { scale, color, defaultText, space } from "container/variables/common";
import Config from "container/config/server.config";
import { getRequest } from "container/utils/request";
import { back } from "container/utils/router";
import Avatar from "container/component/ui/avatar";
import { fontSize } from "../../../variables/common";

const SelectModal = (props) => {
  //props
  const {
    isMember,
    intl,
    style,
    multiSelect,
    optionIndexName,
    api,
    params,
    onSelectItem,
    componentId,
    title,
  } = props;

  //state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  let page = 1;
  let meta = {};

  //#region  effect
  useEffect(() => {
    if (props.data && props.data.length) setData(props.data);
    else getData();
  }, [props.data]);

  useEffect(() => {
    if (props.selectedItem) setSelectedItem(props.selectedItem);
  }, [props.selectedItem]);
  //#endregion

  //#region  function
  const getData = (page = 1) => {
    setLoading(true);
    getRequest(Config.API_URL.concat(api), { ...params, page }).then((res) => {
      setLoading(false);
      let tempData = [...data];
      if (res && res.data) {
        if (res.data.items) {
          if (page > 1) tempData = tempData.concat(res.data.items);
          else tempData = res.data.items;
          meta = res.data.meta;
        } else {
          if (page > 1) tempData = tempData.concat(res.data);
          else tempData = res.data;
        }
        setData(tempData);
      }
    });
  };

  const onPress = (item) => {
    if (multiSelect) {
      let temp = [...selectedItem];
      let indexItem = -1;
      temp.find((i, index) => {
        if (i.id == item.id) {
          indexItem = index;
          return;
        }
      });
      if (indexItem > -1) {
        temp.splice(indexItem, 1);
      } else {
        temp.push(item);
      }
      setSelectedItem(temp);
    } else {
      onSelectItem && onSelectItem(item);
      back();
    }
  };

  const loadMore = () => {
    page++;
    if (meta.total_page && page <= meta.total_page) this.getData(page);
  };

  const onMultiSelectDone = () => {
    onSelectItem && onSelectItem(selectedItem);
    back();
  };
  //#endregion

  //render
  const renderItem = ({ item }) => {
    console.log("renderItem:::", selectedItem);
    let isSelected = false;

    if (multiSelect) {
      selectedItem.find((i) => {
        if (i.id == item.id) {
          isSelected = true;
          return;
        }
      });
    } else if (selectedItem) {
      if (selectedItem.id == item.id) {
        isSelected = true;
      }
    }

    return (
      <TouchableOpacity onPress={() => onPress(item)} style={styles.rowItem}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isMember ? (
            <Avatar
              style={{ marginRight: space.itemMargin }}
              data={item}
              size={scale(80)}
            />
          ) : null}
          <Text style={styles.text}>
            {item.title
              ? item.title
              : optionIndexName
              ? item[optionIndexName]
              : item.name}
          </Text>
        </View>
        {isSelected ? (
          <Icon
            name="ios-checkmark"
            style={{
              fontSize: scale(50),
              color: color.warning,
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <Container style={{ backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => back()}>
          <Image
            source={require("container/asset/icon/icon_topbar_close.png")}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>
          {title || intl.formatMessage(Messages.select)}
        </Text>
        <TouchableWithoutFeedback onPress={() => onMultiSelectDone()}>
          <Text style={styles.done}>{intl.formatMessage(Messages.done)}</Text>
        </TouchableWithoutFeedback>
      </View>
      {loading ? (
        <Spinner />
      ) : data && data.length ? (
        <View>
          <FlatList
            style={{ ...styles.container, ...style }}
            data={data}
            renderItem={props.renderItem ? props.renderItem : renderItem}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={loadMore}
          />
        </View>
      ) : (
        <View style={styles.textBox}>
          <Text style={styles.text}>
            {intl.formatMessage(Messages.empty_data)}
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = {
  header: {
    padding: space.bgPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(40),
  },
  title: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
  },
  done: {
    ...defaultText,
    color: color.success,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(25),
    paddingHorizontal: space.bgPadding,
    borderBottomWidth: scale(2),
    borderBottomColor: color.lightGrey,
    backgroundColor: "#fff",
  },
  container: {},
  textBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: space.componentMargin,
  },
  text: {
    ...defaultText,
  },
};

export default injectIntl(SelectModal);
