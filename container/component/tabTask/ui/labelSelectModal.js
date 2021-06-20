import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import SelectModal from "container/component/ui/selectModal";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  
} from "container/variables/common";
import { Icon } from "native-base";
import CreateModal from "./labelCreateModal";
import update from "immutability-helper";
import { getRequest } from "container/utils/request";

const LabelSelectModal = (props, ref) => {
  const { onDone } = props;

  const [selectedData, setSelectedData] = useState([]);
  const [externalData, setExternalData] = useState([]);
  const [meta, setMeta] = useState({});

  const selectRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  useEffect(() => {
    getData();
  }, []);

  //function -----------------------------------------------------

  const show = (value = null) => {
    if (value) setSelectedData(value);
    getData();
    selectRef.current.show();
  };

  const hide = () => {
    selectRef.current.hide();
  };

  const getData = () => {
    getRequest("label/get").then((res) => {
      if (res && res.data) {
        if (res.data && res.data.length) setExternalData(res.data);
      }
    });
  };

  const onSelectLabel = (item) => {
    const index = selectedData.findIndex((i) => i.id == item.id);
    if (index >= 0)
      setSelectedData(update(selectedData, { $splice: [[index, 1]] }));
    else setSelectedData(update(selectedData, { $push: [item] }));
  };

  const onDeleteLabel = (index) => {
    setExternalData(update(externalData, { $splice: [[index, 1]] }));
  };

  //render -------------------------------------------------------
  const renderItem = (item, index, updateRef) => {
    const checked = selectedData.find((i) => i.id == item.id);

    return (
      <View style={styles.labelBox}>
        <TouchableOpacity
          style={styles.labelTitle(item.color)}
          activeOpacity={1}
          onPress={() => onSelectLabel(item, index)}
        >
          <Text style={styles.labelText}>{item.title}</Text>
          {checked ? (
            <View style={styles.checkedBox}>
              <Icon
                type="FontAwesome5"
                name="check"
                style={styles.checkedIcon}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => updateRef.current.show(item)}
        >
          <Icon type="FontAwesome5" name="pen" style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDeleteLabel(index)}
        >
          <Icon type="FontAwesome5" name="trash" style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SelectModal
      renderItem={renderItem}
      ref={selectRef}
      onDone={(value) => onDone(value)}
      selectedData={selectedData}
      externalData={externalData}
      multiSelect={true}
      QuickCreateModal={CreateModal}
    />
  );
};

export default forwardRef(LabelSelectModal);

const styles = StyleSheet.create({
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.itemMargin,
  },
  labelTitle: (color) => ({
    flex: 1,
    backgroundColor: color,
    borderRadius: space.border,
    paddingVertical: space.itemMargin,
    paddingHorizontal: space.componentMargin,
  }),
  labelText: {
    
    color: "#fff",
    fontWeight: "bold",
  },
  actionBtn: {},
  actionIcon: {
    fontSize: scale(30),
    color: color.grey,
    marginLeft: space.itemMargin,
  },
  checkedBox: {
    width: scale(50),
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderBottomLeftRadius: space.border,
    borderBottomRightRadius: space.border,
    position: "absolute",
    right: space.componentMargin,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  checkedIcon: {
    fontSize: scale(25),
    color: color.text,
  },
});
