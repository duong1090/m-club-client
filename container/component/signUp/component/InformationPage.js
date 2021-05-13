import { Tabs, Tab, ScrollableTab } from "native-base";
import React, { useEffect, useState } from "react";
import InputItem from "container/component/ui/inputItem";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import update from "immutability-helper";
import { showSpinner, hideSpinner } from "container/utils/router";
import Messages from "container/translation/Message";
import { injectIntl } from "react-intl";
import { signInWithPhoneNumber } from "container/action/authenticate";
import Toast from "react-native-simple-toast";
import { loginSuccess } from "container/action/user";
import {
  scale,
  color,
  fontSize,
  defaultText,
  space,
  shadow,
} from "container/variables/common";

const DEFAULT_INFO = {
  club_name: null,
  code: null,
  phone: null,
  mem_name: null,
};

const VERIFY_TAB = 2;

const InformationPage = (props) => {
  //props
  const { intl } = props;
  //state
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [otp, setOTP] = useState(null);
  const [confirmOTP, setConfirmOTP] = useState(null);
  const [currTab, setCurrTab] = useState(0);

  //hooks -------------------------------------------------------------------------------------
  useEffect(() => {
    if (currTab == VERIFY_TAB) onVerifyPhone();
  }, [currTab]);

  //function ----------------------------------------------------------------------------------
  const onChangeInfo = (fieldName, value) => {
    setInfo(update(info, { [fieldName]: { $set: value } }));
  };

  const onNext = () => {
    if (currTab >= VERIFY_TAB - 1) {
      if (validateForm()) setCurrTab(VERIFY_TAB);
      console.log("onNext:::", validateForm());
    } else {
      setCurrTab(currTab + 1);
    }
  };

  const onBack = () => {
    setCurrTab(currTab <= 0 ? 0 : currTab - 1);
  };

  const validateForm = () => {
    const dataIndex = Object.keys(info).findIndex(
      (key) => !info[key] || info[key] == ""
    );

    //if has not already filled all field
    if (dataIndex >= 0) {
      Toast.show(intl.formatMessage(Messages.pls_fill_required), Toast.LONG);
      return false;
    }
    return true;
  };

  const onVerifyPhone = () => {
    showSpinner();
    signInWithPhoneNumber(info.phone)
      .then((confirm) => {
        if (confirm) setConfirmOTP(confirm);
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const activePhone = () => {
    if (confirmOTP && otp) {
      showSpinner();
      confirmOTP
        .confirm(otp)
        .then((result) => {
          if (result) {
            doSignUp();
          }
        })
        .catch((err) => {
          console.error(err);
          hideSpinner();
        });
    }
  };

  const doSignUp = () => {
    postRequest("auth/sign-up", info)
      .then((res) => {
        if (res && res.data) {
          loginSuccess(res.data);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  //render ------------------------------------------------------------------------------------
  const renderHeading = () => {
    return (
      <Text style={styles.textTitle}>
        {intl.formatMessage(Messages.sign_up)}
      </Text>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationBox}>
        {TABS.map((tab, index) =>
          index > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={styles.line(currTab, index)} />
              <View style={styles.numberBox(currTab, index)}>
                <Text style={styles.textPagination(currTab, index)}>
                  {index + 1}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.numberBox(currTab, index)}>
              <Text style={styles.textPagination(currTab, index)}>
                {index + 1}
              </Text>
            </View>
          )
        )}
      </View>
    );
  };

  const renderSubmit = () => {
    const isVerify = currTab >= TABS.length - 1;

    return (
      <View style={styles.buttonBox}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderTopLeftRadius: space.border * 2,
              borderBottomLeftRadius: space.border * 2,
              borderRightWidth: scale(2),
              borderColor: color.lightGrey,
            },
          ]}
          onPress={() => onBack()}
        >
          <Text
            style={[
              styles.textSubmit,
              currTab == 0 ? { color: color.lightGrey } : null,
            ]}
          >
            {intl.formatMessage(Messages.back)}
          </Text>
        </TouchableOpacity>
        {isVerify ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopRightRadius: space.border * 2,
                borderBottomRightRadius: space.border * 2,
              },
            ]}
            onPress={() => activePhone()}
          >
            <Text style={[styles.textSubmit, { color: color.success }]}>
              {intl.formatMessage(Messages.done)}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopRightRadius: space.border * 2,
                borderBottomRightRadius: space.border * 2,
              },
            ]}
            onPress={() => onNext()}
          >
            <Text style={[styles.textSubmit, { color: color.blue }]}>
              {intl.formatMessage(Messages.next)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderClubInfo = () => {
    return (
      <React.Fragment>
        <InputItem
          style={styles.input}
          placeholder={intl.formatMessage(Messages.club_name)}
          onChangeText={(text) => onChangeInfo("club_name", text)}
          value={info.club_name}
        />

        <InputItem
          placeholder={intl.formatMessage(Messages.club_code)}
          onChangeText={(code) => onChangeInfo("code", code)}
          value={info.code}
        />
      </React.Fragment>
    );
  };

  const renderAdminInfo = () => {
    return (
      <React.Fragment>
        <InputItem
          style={styles.input}
          placeholder={intl.formatMessage(Messages.admin_name)}
          onChangeText={(text) => onChangeInfo("mem_name", text)}
          value={info.mem_name}
        />

        <InputItem
          placeholder={intl.formatMessage(Messages.phone)}
          onChangeText={(phone) => onChangeInfo("phone", phone)}
          value={info.phone}
          keyboardType="numeric"
        />
      </React.Fragment>
    );
  };

  const renderOTP = () => {
    return (
      <InputItem
        inputStyle={{ fontSize: fontSize.size36 }}
        style={styles.input}
        type="otp"
        textAlign="center"
        placeholder={intl.formatMessage(Messages.otp)}
        onChangeText={(code) => setOTP(code)}
        value={otp ? otp : undefined}
      />
    );
  };

  const TABS = [
    {
      heading: intl.formatMessage(Messages.club_information),
      render: renderClubInfo(),
    },
    {
      heading: intl.formatMessage(Messages.admin_information),
      render: renderAdminInfo(),
    },
    {
      heading: intl.formatMessage(Messages.verification),
      render: renderOTP(),
    },
  ];

  const renderTab = () => {
    return (
      <Tabs
        initialPage={0}
        page={currTab}
        renderTabBar={() => (
          <ScrollableTab style={{ height: 0, borderWidth: 0 }} />
        )}
      >
        {TABS.map((tab) => (
          <Tab heading="">
            <View style={styles.headingBox}>
              <Text style={styles.textHeading}>{tab.heading}</Text>
            </View>
            <View style={styles.bodyBox}>{tab.render}</View>
          </Tab>
        ))}
      </Tabs>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeading()}
      {renderPagination()}
      {renderTab()}
      {renderSubmit()}
    </View>
  );
};

export default injectIntl(InformationPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: scale(40),
  },
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: space.componentMargin,
    marginBottom: space.componentMargin,
    borderRadius: space.border * 2,
    backgroundColor: color.light,
    ...shadow,
  },
  button: {
    flexDirection: "row",
    height: scale(80),
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textSubmit: {
    ...defaultText,
    fontSize: fontSize.size30,
    fontWeight: "bold",
  },
  textTitle: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: space.componentMargin,
  },
  headingBox: {
    backgroundColor: "#fff",
    margin: space.componentMargin,
    borderRadius: scale(40),
    paddingVertical: space.itemMargin,
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
  textHeading: {
    ...defaultText,
    fontSize: fontSize.sizeContent,
  },
  bodyBox: {
    margin: space.componentMargin,
  },
  paginationBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: space.componentMargin,
    marginBottom: scale(60),
  },
  numberBox: (currTab, index) => ({
    width: scale(60),
    aspectRatio: 1,
    borderRadius: scale(30),
    backgroundColor: index <= currTab ? color.success : color.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  }),
  line: (currTab, index) => ({
    flex: 1,
    borderBottomWidth: scale(4),
    borderColor: index <= currTab ? color.success : color.lightGrey,
  }),
  textPagination: (currTab, index) => ({
    ...defaultText,
    fontSize: fontSize.size32,
    color: "#fff",
  }),
});
