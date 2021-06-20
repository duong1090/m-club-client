import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "react-native-modal";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./styles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import List from "./component/list";
import Date from "./component/date";
import Messages from "container/translation/Message";
import { getIntl } from "container/utils/common";
import { color } from "../../../variables/common";

const SelectModal = (props, ref) => {
  //props
  const { type, titleSubmit, title, onDone, quickCreate } = props;

  //state
  const [visible, setVisible] = useState(false);

  //ref
  const childrenRef = useRef(null);

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
    childrenRef,
  }));

  //function -----------------------------------------------------------------------------------------------

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    setVisible(false);
    const value = childrenRef ? childrenRef.current.getValues() : null;
    console.log("onSubmit:::SelectModal", value);
    onDone && onDone(value);
  };

  //render -------------------------------------------------------------------------------------------------
  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <Text style={styles.headerText}>
          {title ? title : getIntl().formatMessage(Messages.select)}
        </Text>
        <TouchableOpacity
          style={styles.closeIconWrapper}
          onPress={() => setVisible(false)}
        >
          <FontAwesome5 name="times" style={styles.closeIcon} regular />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    switch (type) {
      case "list":
        return (
          <List {...props} style={styles.contentWrapper} ref={childrenRef} />
        );
      case "date":
        return (
          <Date {...props} style={styles.contentWrapper} ref={childrenRef} />
        );
      default:
        return (
          <List {...props} style={styles.contentWrapper} ref={childrenRef} />
        );
    }
  };

  return (
    <Modal
      propagateSwipe
      isVisible={visible}
      style={styles.modalWrapper}
      backdropOpacity={0.5}
      // onSwipeComplete={() => setVisible(false)}
      onBackdropPress={() => hide()}
      onBackButtonPress={() => hide()}
      // useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      swipeDirection={["down"]}
    >
      <View style={styles.modalView}>
        {renderHeader()}
        <View style={styles.bodyBox}>{renderContent()}</View>
        <TouchableOpacity style={styles.btnStyle} onPress={() => onSubmit()}>
          <Text style={styles.btnText}>
            {titleSubmit ? titleSubmit : getIntl().formatMessage(Messages.done)}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  return;
};

export default forwardRef(SelectModal);
