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
  defaultText,
} from "container/variables/common";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
const { height } = Dimensions.get("window");
const intl = getIntl();

const DateType = (props, ref) => {
  const { typePicker, valuePicker } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  //hooks
  useImperativeHandle(ref, () => ({
    getValues,
  }));

  useEffect(() => {
    if (valuePicker) {
      console.log('caiquanquegiv', valuePicker)

      switch (typePicker) {
        case "date":
          setDate(new Date(valuePicker));
          break;
        case "time":
          setTime(new Date(`12/10/1999 ${valuePicker}`));
          break;
        case "date_time":
          const splitValue = valuePicker.split(" ");
          console.log("date_time:::", valuePicker, splitValue);
          setDate(new Date(splitValue[0]));
          setTime(new Date(valuePicker));
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
    console.log("renderPicker:::", type, value);
    const formatValue = moment(value).format(format);
    return (
      <View style={styles.pickerBox}>
        <View style={styles.textBox}>
          <Text style={styles.textValue}>{formatValue}</Text>
        </View>
        <DatePicker mode={type} date={value} onDateChange={onChange} />
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
    marginBottom: space.componentMargin,
    alignItems: "center",
  },
  textBox: {
    backgroundColor: color.hint,
    padding: space.bgPadding,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
  textValue: {
    ...defaultText,
    fontWeight: "bold",
  },
});
