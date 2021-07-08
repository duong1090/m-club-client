import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Config from "container/config/server.config";
import { getRequest } from "container/utils/request";
import {
  scale,
  color,
  fontSize,
  space,
  shadow,
} from "container/variables/common";
import { Dimensions } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import RadioButton from "container/component/ui/radioButton";
import EmptyData from "container/component/ui/emptyData";
import Avatar from "container/component/ui/avatar";
import update from "immutability-helper";
import Messages from "container/translation/Message";
import { getIntl } from "container/utils/common";

const { height } = Dimensions.get("window");

const List = (props, ref) => {
  //props
  const {
    externalData,
    api,
    params,
    multiSelect,
    isMember,
    QuickCreateModal,
    onLoadMore,
  } = props;

  //state
  const [internalData, setInternalData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [meta, setMeta] = useState({});

  //variables
  const createRef = useRef(null);
  const page = useRef(1);

  //hooks
  useEffect(() => {
    if (externalData && externalData.length) setInternalData(externalData);
  }, [externalData]);

  useEffect(() => {
    if (api) getData();
  }, []);

  useEffect(() => {
    if (props.selectedData) setSelectedData(props.selectedData);
  }, [props.selectedData]);

  useImperativeHandle(ref, () => ({
    getValues,
  }));

  //function -------------------------------------------------------------------------------------------------

  const getData = (page = 1) => {
    const finalParams = { ...params };

    getRequest(api, finalParams).then((res) => {
      if (res && res.data) {
        const { items, meta } = res.data;
        if (meta) setMeta(meta);
        if (items) {
          if (page && page > 1) setInternalData(internalData.concat(items));
          else setInternalData(items);
        } else setInternalData(res.data);
      }
    });
  };

  const onDeleteItem = (index) => {
    const tempData = [...internalData];
    tempData.splice(index, 1);
    setInternalData(tempData);
  };

  const checkOneItem = (item) => {
    console.log("checkOneItem:::", item);

    setSelectedData([item]);
  };

  const checkMultiItem = (item) => {
    const indexItem = selectedData.findIndex((i) => i.id == item.id);
    if (indexItem < 0) {
      setSelectedData(update(selectedData, { $push: [item] }));
    } else {
      setSelectedData(update(selectedData, { $splice: [[indexItem, 1]] }));
    }
  };

  const getValues = () => {
    return !multiSelect && selectedData.length == 1
      ? selectedData[0]
      : selectedData;
  };

  const openCreateModal = () => {
    createRef && createRef.current.show();
  };

  const createCallback = (value) => {
    setInternalData(update(internalData, { $unshift: [value] }));
  };

  const updateCallback = (value) => {
    const dataIndex = internalData.findIndex((item) => item.id == value.id);
    setInternalData(update(internalData, { [dataIndex]: { $set: value } }));
  };

  const loadMore = () => {
    if (meta.total_page && page.current < meta.total_page) {
      page.current++;
      getData(page.current);
    }
  };

  //render ---------------------------------------------------------------------------------------------------

  const renderItem = (item, index) => {
    const checked = Array.isArray(selectedData)
      ? selectedData.findIndex((data) => data.id == item.id) >= 0
        ? true
        : false
      : selectedData.id == item.id;

    const label = item.title ? item.title : item.name ? item.name : "";

    console.log("renderItem:::", checked, item, label);

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          multiSelect ? checkMultiItem(item) : checkOneItem(item)
        }
        style={styles.listItem(index)}
      >
        {multiSelect ? (
          <CheckBox
            disabled={false}
            value={checked}
            boxType="square"
            lineWidth={1}
            // onChange={() => checkMultiItem(item)}
            tintColors={{ true: color.done }}
            style={{ width: scale(40), height: scale(40) }}
          />
        ) : (
          <RadioButton selected={checked} onChange={() => checkOneItem(item)} />
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.textItem}>{label}</Text>
          {isMember ? (
            <Avatar
              style={{ marginLeft: scale(20) }}
              data={item}
              size={scale(80)}
              noShadow
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAdd = () => {
    return (
      <TouchableOpacity
        style={styles.quickAddBox}
        onPress={() => openCreateModal()}
      >
        <Text style={styles.btnText}>
          {getIntl().formatMessage(Messages.add)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          contentContainerStyle={[
            styles.listWrapper(internalData),
            props.renderItem ? { borderWidth: 0 } : null,
          ]}
          data={internalData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>
            props.renderItem
              ? props.renderItem(item, index, createRef)
              : renderItem(item, index)
          }
          ListEmptyComponent={<EmptyData />}
          onEndReached={onLoadMore ? onLoadMore() : loadMore()}
          onEndReachedThreshold={0.5}
        />
      </ScrollView>

      {QuickCreateModal ? renderQuickAdd() : null}

      {QuickCreateModal ? (
        <QuickCreateModal
          ref={createRef}
          updateCallback={updateCallback}
          createCallback={createCallback}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(30),
    maxHeight: (60 * height) / 100,
  },
  listWrapper: (data) => ({
    marginHorizontal: space.componentMargin,
    marginTop: scale(30),
    borderRadius: scale(20),
    borderWidth: data.length ? scale(1) : 0,
    borderColor: color.grey,
  }),

  listItem: (index) => {
    let obj = {
      flexDirection: "row",
      paddingVertical: scale(20),
      paddingHorizontal: scale(30),
      borderColor: color.grey,
      justifyContent: "space-between",
      alignItems: "center",
    };
    if (index > 0) obj.borderTopWidth = scale(1);

    return obj;
  },
  textItem: {},

  quickAddBox: {
    flexDirection: "row",
    paddingVertical: space.itemMargin,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: space.componentMargin,
    marginTop: space.componentMargin,
    borderRadius: space.border,
    borderColor: color.grey,
    borderWidth: scale(1),
    borderStyle: "dashed",
  },
  btnText: { color: color.grey, fontWeight: "bold" },
});

export default forwardRef(List);
