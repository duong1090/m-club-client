import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BottomPopUp from "container/component/ui/bottomPopUp";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
  
} from "container/variables/common";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import { postRequest } from "container/utils/request";
import ModalContext from "container/context/modal";

const { height } = Dimensions.get("window");

const colors = [
  "#e8384f",
  "#fd612c",
  "#fd9a00",
  "#eec300",
  "#a4cf30",
  "#37c5ab",
  "#20aaea",
  "#4186e0",
  "#7a6ff0",
  "#aa62e3",
  "#e362e3",
  "#ea4e9d",
  "#fc91ad",
  "#8da3a6",
];

const DEFAULT_FORM_VALUE = {
  title: null,
  color: null,
};

const LabelCreateModal = (props, ref) => {
  //props
  const { createCallback, updateCallback } = props;
  //state
  const [formValue, setFormValue] = useState(DEFAULT_FORM_VALUE);
  const [mode, setMode] = useState("create");

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //variables
  const bottomPopUpRef = useRef(null);
  const intl = getIntl();

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function
  const show = (value = null) => {
    console.log("showne:::::", value);
    if (value) {
      setFormValue(value);
      setMode("edit");
    }
    bottomPopUpRef.current.show();
  };

  const hide = () => {
    bottomPopUpRef.current.hide();
    resetFields();
  };

  const resetFields = () => {
    setFormValue(DEFAULT_FORM_VALUE);
    setMode("create");
  };

  const createLabel = () => {
    showSpinner();

    const params = {};
    if (formValue.title) params.title = formValue.title;
    if (formValue.color) params.color = formValue.color;

    postRequest("label/create", params)
      .then((res) => {
        if (res && res.data) {
          createCallback && createCallback(res.data);
          hide();
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const updateLabel = () => {
    showSpinner();

    const params = {};
    if (formValue.id) params.id = formValue.id;
    if (formValue.title) params.title = formValue.title;
    if (formValue.color) params.color = formValue.color;

    postRequest("label/update", params)
      .then((res) => {
        if (res && res.data) {
          updateCallback && updateCallback(res.data);
          hide();
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const onChangeFormValue = (fieldName, value) => {
    const tempForm = { ...formValue };
    tempForm[fieldName] = value;
    setFormValue(tempForm);
  };

  const onSelectColor = (item) => {
    onChangeFormValue("color", item);
  };

  //render -------------------------------------------------------------------------
  const renderColorList = () => {
    return (
      <FlatList
        data={colors}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.colorBorder(item == formValue.color)}
            onPress={() => onSelectColor(item)}
          >
            <View style={styles.colorBox(item)} />
          </TouchableOpacity>
        )}
        numColumns={7}
      />
    );
  };

  return (
    <BottomPopUp
      ref={bottomPopUpRef}
      reset={resetFields}
      body={
        <View style={styles.container}>
          <TextInput
            value={formValue.title}
            multiline
            placeholder={intl.formatMessage(Messages.name)}
            onChangeText={(text) => onChangeFormValue("title", text)}
          />
          {renderColorList()}
        </View>
      }
      toolbar={() => (
        <TouchableOpacity
          style={styles.doneBox}
          onPress={() => (mode == "create" ? createLabel() : updateLabel())}
        >
          <Text style={styles.textDoneBtn}>
            {intl.formatMessage(Messages.done)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default forwardRef(LabelCreateModal);

const styles = StyleSheet.create({
  container: {
    height: height * 0.3,
  },
  colorBorder: (selected) => ({
    flex: 1,
    aspectRatio: 1,
    borderWidth: scale(4),
    borderColor: selected ? color.background : "#fff",
    borderRadius: space.border,
    padding: scale(4),
    margin: scale(5),
  }),
  colorBox: (color) => ({
    flex: 1,
    backgroundColor: color,
    borderRadius: space.border / 1.5,
  }),
  textDoneBtn: {
    
    color: "#fff",
  },
  doneBox: {
    flex: 1,
    marginTop: space.componentMargin,
    paddingVertical: space.itemMargin,
    backgroundColor: color.success,
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
  },
});
