import React, { forwardRef, useImperativeHandle } from "react";
import ModalPopUp from "container/component/ui/modalPopUp";
import { View } from "react-native";

const Detail = (props, ref) => {
  
  
  return (
    <ModalPopUp
      title={intl.formatMessage(Messages.activity)}
      visible={visibleActivity}
      transparent
      animationType="fade"
      maskClose={() => {
        setVisibleActivity(false);
      }}
      onClose={() => {
        setVisibleActivity(false);
      }}
      width="90%"
      height="80%"
    >
      <View style={styles.activityModal}></View>
    </ModalPopUp>
  );
};

export default forwardRef(Detail);
