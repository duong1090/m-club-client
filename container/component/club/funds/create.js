import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useContext,
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import BottomPopUp from "container/component/ui/bottomPopUp";
import { scale, color, fontSize, space } from "container/variables/common";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import { Icon, Textarea } from "native-base";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import ModalContext from "container/context/modal";

const RADIO_BUTTON = { revenue: 1, pay: 0 };

const CreateFund = (props, ref) => {
  //props
  const { updateCallback } = props;
  //state
  const [reason, setReason] = useState(null);
  const [isRevenue, setIsRevenue] = useState(1);
  const [amount, setAmount] = useState(null);
  const intl = getIntl();

  //variables
  const bottomPopUpRef = useRef(null);

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //effect
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event
  const show = () => {
    bottomPopUpRef.current.show();
  };

  const hide = () => {
    bottomPopUpRef.current.hide();
    setReason(null);
    setIsRevenue(1);
    setAmount(null);
  };

  const create = () => {
    showSpinner();

    let params = {};
    if (reason) params.reason = reason;
    if (amount) params.amount = amount;
    params.is_revenue = isRevenue;

    postRequest("fund/update", params)
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

  //render
  const renderAmount = () => {
    return (
      <TextInput
        keyboardType="numeric"
        autoFocus
        onChangeText={(text) => setAmount(text)}
        autoCorrect={false}
        placeholder={intl.formatMessage(Messages.amount)}
        style={{
          fontSize: fontSize.size32,
        }}
        blurOnSubmit={false}
        returnKeyType="next"
      />
    );
  };

  const renderBtnRevenue = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={styles.radioBtn(RADIO_BUTTON["revenue"])}
          onPress={() => setIsRevenue(RADIO_BUTTON["revenue"])}
        >
          <View
            style={styles.radioBtnIconBox(RADIO_BUTTON["revenue"], isRevenue)}
          >
            {isRevenue ? (
              <Icon
                style={styles.radioBtnIcon}
                type="FontAwesome"
                name="circle"
              />
            ) : null}
          </View>
          <Text style={styles.radioBtnText}>
            {intl.formatMessage(Messages.revenue)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioBtn(RADIO_BUTTON["pay"])}
          onPress={() => setIsRevenue(RADIO_BUTTON["pay"])}
        >
          <View style={styles.radioBtnIconBox(RADIO_BUTTON["pay"], isRevenue)}>
            {!isRevenue ? (
              <Icon
                style={styles.radioBtnIcon}
                type="FontAwesome"
                name="circle"
              />
            ) : null}
          </View>
          <Text style={styles.radioBtnText}>
            {intl.formatMessage(Messages.pay)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReason = () => {
    return (
      <View style={{ flex: 1 }}>
        <Textarea
          onChangeText={(text) => setReason(text)}
          rowSpan={3}
          placeholder={intl.formatMessage(Messages.purpose_fund)}
          style={{
            flex: 1,
            marginTop: scale(60),
            paddingLeft: 0,
          }}
        />
      </View>
    );
  };

  return (
    <BottomPopUp
      ref={bottomPopUpRef}
      body={
        <View style={{ height: scale(800), marginVertical: scale(30) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {renderAmount()}
            {renderBtnRevenue()}
          </View>
          {renderReason()}
        </View>
      }
      toolbar={() => (
        <TouchableOpacity onPress={() => create()} style={styles.createButton}>
          <Text style={styles.textCreateButton}>
            {intl.formatMessage(Messages.update)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  createButton: {
    flex: 1,
    padding: scale(20),
    borderRadius: space.border,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreateButton: {
    color: "#fff",
  },
  radioBtn: (isRevenue) => ({
    flexDirection: "row",
    alignItems: "center",
    marginRight: isRevenue ? space.componentMargin : 0,
  }),
  radioBtnIconBox: (type, isRevenue) => ({
    width: scale(40),
    height: scale(40),
    marginRight: scale(10),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scale(4),
    borderColor: type == isRevenue ? color.primary : color.grey,
    borderRadius: scale(25),
  }),
  radioBtnIcon: {
    fontSize: scale(25),
    color: color.primary,
  },
  radioBtnText: {},
});

export default forwardRef(CreateFund);
