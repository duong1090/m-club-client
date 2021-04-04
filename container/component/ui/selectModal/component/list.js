import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FlatList, StyleSheet, Text, View, ScrollView } from "react-native";
import Config from "container/config/server.config";
import { getRequest } from "container/utils/request";
// import CheckBox from "@src/components/ui/checkbox";
// import RadioButton from "@src/components/ui/radioButton/RadioButton";
import {
  scale,
  color,
  fontSize,
  space,
  defaultText,
  shadow,
} from "container/variables/common";
import { Dimensions } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import RadioButton from "container/component/ui/radioButton";
import EmptyData from "container/component/ui/emptyData";
import Avatar from "container/component/ui/avatar";

const { height } = Dimensions.get("window");

const List = (props, ref) => {
  //props
  const { externalData, api, params, multiSelect, isMember } = props;

  //state
  const [internalData, setInternalData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  //variables
  let page = 1;

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

  const getData = (extendParams = {}) => {
    const finalParams = { ...params, extendParams };
    const { page } = extendParams;

    getRequest(Config.API_URL.concat(api), finalParams).then((res) => {
      if (res && res.data) {
        const { items } = res.data;

        if (items) {
          if (page && page > 1) setInternalData(internalData.concat(items));
          else setInternalData(items);
        } else setInternalData(res.data);
      }
    });
  };

  const checkOneItem = (item) => {
    setSelectedData([item]);
  };

  const checkMultiItem = (item) => {
    let temp = [...selectedData];
    temp.push(item);
    setSelectedData(temp);
  };

  const getValues = () => {
    return !multiSelect && selectedData.length == 1
      ? selectedData[0]
      : selectedData;
  };

  //render ---------------------------------------------------------------------------------------------------

  const renderItem = (item, index) => {
    const checked = Array.isArray(selectedData)
      ? selectedData.findIndex((data) => data.id == item.id) >= 0
        ? true
        : false
      : selectedData.id == item.id;

    const label = item.title ? item.title : item.name ? item.name : "";

    return (
      <View style={styles.listItem(index)}>
        {multiSelect ? (
          <CheckBox
            disabled={false}
            value={checked}
            onChange={() => checkMultiItem(item)}
            tintColors={{ true: color.done }}
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          contentContainerStyle={styles.listWrapper(internalData)}
          data={internalData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderItem(item, index)}
          ListEmptyComponent={<EmptyData />}
        />
      </ScrollView>
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
    borderWidth: data.length ? scale(2) : 0,
    borderColor: "#cbcbcb",
  }),

  listItem: (index) => {
    let obj = {
      flexDirection: "row",
      paddingVertical: scale(20),
      paddingHorizontal: scale(30),
      borderColor: "#cbcbcb",
      justifyContent: "space-between",
      alignItems: "center",
    };
    if (index > 0) obj.borderTopWidth = scale(2);

    return obj;
  },
  textItem: {
    ...defaultText,
  },
});

export default forwardRef(List);
