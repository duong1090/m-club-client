import moment from "moment";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  scale,
  color,
  fontSize,
  shadow,
  space,
} from "container/variables/common";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
const { height } = Dimensions.get("window");

const TIME_FORMAT = "HH:mm:ss";
const DATE_FORMAT = "YYYY-MM-DD";
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

const DateType = (props, ref) => {
  const { typePicker, valuePicker } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const intl = getIntl();

  //hooks
  useImperativeHandle(ref, () => ({
    getValues,
  }));

  useEffect(() => {
    if (valuePicker) {
      console.log("caiquanquegiv", valuePicker);

      switch (typePicker) {
        case "date":
          setDate(moment(valuePicker).toDate());
          break;
        case "time":
          setTime(moment(valuePicker, TIME_FORMAT).toDate());
          break;
        case "date_time":
          const splitValue = valuePicker.split(" ");
          console.log("date_time:::", valuePicker, splitValue);
          setDate(moment(splitValue[0], DATE_FORMAT).toDate());
          setTime(moment(splitValue[1], TIME_FORMAT).toDate());
      }
    }
  }, [typePicker, valuePicker]);

  //function --------------------------------------------------------------------------------
  const getValues = () => {
    switch (typePicker) {
      case "date":
        return moment(date).format("YYYY-MM-DD");
      case "time":
        return moment(time).format("HH:mm:ss");
      case "date_time":
        return `${moment(date).format("YYYY-MM-DD")} ${moment(time).format(
          "HH:mm:ss"
        )}`;
    }
  };

  //render ----------------------------------------------------------------------------------

  const renderPicker = (type, value, format, onChange) => {
    return (
      <View style={styles.pickerBox}>
        <DatePicker mode={type} date={value} onDateChange={onChange} />
        <View style={styles.textBox}>
          <Text style={styles.textValue}>
            {intl.formatMessage(Messages[type])}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderPicker(
          "date",
          date,
          intl.formatMessage(Messages.date_format),
          (date) => setDate(date)
        )}
        {renderPicker(
          "time",
          time,
          intl.formatMessage(Messages.due_time_format),
          (time) => setTime(time)
        )}
      </ScrollView>
    </View>
  );
};

export default forwardRef(DateType);

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(30),
    maxHeight: (60 * height) / 100,
  },
  pickerBox: {
    alignItems: "center",
    borderBottomWidth: scale(1),
    borderColor: color.grey,
    paddingVertical: scale(20),
  },
  textBox: {
    backgroundColor: color.lightGreyPlus,
    paddingVertical: scale(5),
    paddingHorizontal: space.componentMargin,
    borderRadius: space.border,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: scale(10),
    left: scale(10),
  },
  textValue: {
    fontSize: fontSize.size24,
    fontWeight: "bold",
  },
});
