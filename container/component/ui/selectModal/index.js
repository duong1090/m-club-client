import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { Container } from "native-base";
import Spinner from "container/component/ui/spinner";
import { scale, color, defaultText } from "container/variables/common";
import Config from "container/config/server.config";
import { getRequest } from "container/utils/request";
import { Navigation } from "react-native-navigation";
import { back } from "container/utils/router";
import { getIntl } from "../utils/common";

const SelectModal = (props) => {
  const {
    intl,
    style,
    multiSelect,
    optionIndexName,
    api,
    params,
    onSelectItem,
    componentId,
  } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const page = 1;
  const meta = {};

  //#region  effect
  useEffect(() => {
    if (!props.data) getData();
  }, []);

  //button header event
  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      ({ buttonId }) => {
        if (buttonId == "done") {
          onMultiSelectDone();
        } else if (buttonId == "back") {
          back();
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [componentId]);

  useEffect(() => {
    if (props.data) setData(props.data);
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
          tempData = tempData.concat(res.data.items);
          meta = res.data.meta;
        } else tempData = tempData.concat(res.data);
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
        <Text style={styles.text}>
          {item.title
            ? item.title
            : optionIndexName
            ? item[optionIndexName]
            : item.name}
        </Text>
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
        <Text style={styles.text}>
          {intl.formatMessage(Messages.empty_data)}
        </Text>
      )}
    </Container>
  );
};

SelectModal.options = (passProps) => {
  const { title, multiSelect } = passProps;
  console.log("Picker passProps", multiSelect);

  const rightButtons = multiSelect
    ? [
        {
          id: "done",
          system: "done",
          text: getIntl().formatMessage(Messages.done),
          showAsAction: "always",
        },
      ]
    : [];
  return {
    topBar: {
      visible: true,
      title: {
        text: title || getIntl().formatMessage(Messages.select),
      },
      rightButtons,
      leftButtons: [
        {
          id: "back",
          icon: require("container/asset/icon/icon_topbar_close.png"),
          visible: true,
        },
      ],
    },
  };
};

const styles = {
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(30),
    paddingVertical: scale(25),
    borderBottomWidth: 0.5,
    borderBottomColor: color.hint,
    backgroundColor: "#fff",
    height: scale(90),
  },
  container: {
    paddingHorizontal: scale(20),
  },
  text: {
    ...defaultText,
  },
};

export default injectIntl(SelectModal);
