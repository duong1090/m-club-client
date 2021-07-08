import React from "react";
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, color, space, fontSize } from "container/variables/common";
import Modal from "react-native-modal";
import { Icon } from "native-base";

const ModalPopUp = (props) => {
  //props
  const { children, style, maskClose, width, height, onClose, title } = props;
  return (
    <Modal
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      backdropOpacity={0.5}
      coverScreen={false}
      onBackdropPress={() => onClose()}
      onBackButtonPress={() => onClose()}
      {...props}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.content,
            style,
            width ? { width: width } : null,
            height ? { height: height } : null,
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {onClose ? (
              <TouchableOpacity onPress={onClose} style={styles.closeIconBox}>
                <Icon name="close-circle" style={styles.closeIcon} />
              </TouchableOpacity>
            ) : null}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: scale(10),
  },
  title: {
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    marginTop: scale(5),
    marginLeft: scale(20),
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: space.border,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeIconBox: {
    alignSelf: "flex-end",
  },
  closeIcon: {
    fontSize: scale(50),
    color: color.hint,
  },
});

export default ModalPopUp;
