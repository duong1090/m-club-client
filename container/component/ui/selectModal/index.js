import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { Container } from "native-base";
import Spinner from "container/component/ui/spinner";
import { scale, color, defaultText, space } from "container/variables/common";
import Config from "container/config/server.config";
import { getRequest } from "container/utils/request";
import { Navigation } from "react-native-navigation";
import { back } from "container/utils/router";

const SelectModal = (props) => {
  //props
  const {
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

  //default option topBar
  Navigation.mergeOptions(componentId, {
    topBar: {
      visible: true,
      rightButtons: multiSelect
        ? [
            {
              id: "done",
              system: "done",
              text: intl.formatMessage(Messages.done),
              showAsAction: "always",
            },
          ]
        : [],
      title: {
        text: title || intl.formatMessage(Messages.select),
      },
      leftButtons: [
        {
          id: "back",
          icon: require("container/asset/icon/icon_topbar_close.png"),
          visible: true,
        },
      ],
    },
  });

  //#region  effect
  useEffect(() => {
    if (!props.data) getData();
    else setData(props.data);
  }, [props.data]);

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
