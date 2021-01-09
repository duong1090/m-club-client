import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  scale,
  color,
  defaultText,
  space,
  shadow,
  fontSize,
} from "container/variables/common";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import { showSpinner, hideSpinner } from "container/utils/router";
import CreateFund from "./create";
import FundDetail from "./detail";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { Icon } from "native-base";

const FundList = (props) => {
  //props
  const { intl } = props;
  //state
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});

  //variables
  const createFundRef = useRef(null);
  const detailFundRef = useRef(null);
  let page = 1;

  //effect -------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // createData();
    getData();
  }, []);

  //function - event ----------------------------------------------------------------------------------------------------------------------
  const openCreateFund = () => {
    createFundRef && createFundRef.current.show();
  };

  const openDetailFund = (item) => {
    detailFundRef && detailFundRef.current.show(item);
  };

  const getData = () => {
    showSpinner();
    getRequest(Config.API_URL.concat("fund/get"), { page })
      .then((res) => {
        if (res && res.data) {
          setData(res.data.items);
          setMeta(res.data.meta);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const loadMore = () => {
    if (page < meta.total_pages) {
      page++;
      getData();
    }
  };

  //render ---------------------------------------------------------------------------------------------------------------------------------
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer(index)}
        onPress={() => openDetailFund(item)}
      >
        <View style={styles.itemLeft}>
          <Icon
            type="Foundation"
            name={item.is_revenue ? "arrow-right" : "arrow-left"}
            style={styles.itemRevenue(item.is_revenue)}
          />
          <Text style={styles.itemText}>
            {item.is_revenue
              ? intl.formatMessage(Messages.revenue)
              : intl.formatMessage(Messages.pay)}
          </Text>
        </View>
        <View style={styles.itemMid}>
          <Text style={styles.itemText} numberOfLines={1}>
            {item.reason}
          </Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={[styles.itemText, styles.amountText]}>
            {item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTable = () => {
    return (
      <View style={styles.table}>
        <View style={styles.itemHeaderContainer}>
          <View style={[styles.itemLeft, styles.headerLeft]}>
            <Text style={styles.itemHeaderText}>Hoạt động</Text>
          </View>
          <View style={[styles.itemMid, styles.headerMid]}>
            <Text style={styles.itemHeaderText}>Mục đích</Text>
          </View>
          <View style={[styles.itemRight, styles.headerRight]}>
            <Text style={styles.itemHeaderText}>Số tiền</Text>
          </View>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderItem(item, index)}
          contentContainerStyle={{ paddingBottom: scale(80) }}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.information}>
        <View style={styles.informationBox}>
          <Text style={styles.informationTitle}>Quỹ hiện tại:</Text>
          <Text style={styles.informationText}>12 300 000</Text>
        </View>
        <View style={styles.informationBox}>
          <Text style={styles.informationTitle}>Tổng hoạt động:</Text>
          <Text style={styles.informationText}>11</Text>
        </View>
      </View>

      {renderTable()}

      <View style={styles.btnUpdateBox}>
        <TouchableOpacity
          onPress={() => openCreateFund()}
          style={styles.btnUpdate}
        >
          <Icon type="FontAwesome5" name="pen" style={styles.btnUpdateIcon} />
          <Text style={styles.btnUpdateText}>Cập nhật quỹ</Text>
        </TouchableOpacity>
      </View>

      <CreateFund ref={createFundRef} />
      <FundDetail ref={detailFundRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: space.bgPadding,
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: space.bgPadding,
    ...shadow,
  },
  headerText: {
    ...defaultText,
    fontSize: fontSize.sizeTitle,
  },
  information: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    marginHorizontal: -space.componentMargin / 2,
    borderRadius: space.border,
  },
  informationBox: {
    flexDirection: "row",
    justifyContent: "center",
  },
  informationTitle: {
    ...defaultText,
    fontWeight: "bold",
    marginRight: scale(10),
  },
  informationText: {
    ...defaultText,
    color: color.grey,
  },

  table: {
    marginTop: space.componentMargin,
  },

  itemHeaderContainer: {
    flexDirection: "row",
    marginHorizontal: -space.componentMargin / 2,
  },
  itemContainer: (index) => ({
    flexDirection: "row",
    backgroundColor: index % 2 == 0 ? "#fff" : color.lightGrey,
    borderBottomWidth: scale(2),
    borderColor: color.lightGrey,
  }),
  itemRevenue: (isRevenue) => ({
    color: isRevenue ? color.success : color.danger,
    fontSize: scale(30),
  }),
  itemText: {
    ...defaultText,
    // fontSize: fontSize.sizeContent,
  },
  itemHeaderText: {
    ...defaultText,
    color: "#fff",
    fontWeight: "bold",
  },
  itemLeft: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  itemMid: {
    flex: 5,
    alignItems: "flex-start",
    borderLeftWidth: scale(2),
    borderRightWidth: scale(2),
    borderColor: color.lightGrey,
    padding: scale(20),
    paddingHorizontal: scale(20),
  },
  itemRight: {
    flex: 3,
    alignItems: "flex-end",
    padding: scale(20),
    paddingHorizontal: scale(20),
  },
  headerLeft: {
    backgroundColor: color.primary,
    borderTopLeftRadius: space.border,
    borderBottomLeftRadius: space.border,
    justifyContent: "center",
    paddingVertical: scale(10),

    ...shadow,
  },
  headerMid: {
    backgroundColor: color.primary,
    paddingHorizontal: scale(5),
    paddingVertical: scale(10),
    alignItems: "center",
    borderColor: "#fff",
    ...shadow,
  },
  headerRight: {
    alignItems: "center",
    backgroundColor: color.primary,
    borderTopRightRadius: space.border,
    borderBottomRightRadius: space.border,
    paddingVertical: scale(10),
    ...shadow,
  },
  btnUpdateBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    paddingBottom: scale(15),
    alignItems: "center",
  },
  btnUpdate: {
    backgroundColor: color.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),
    borderRadius: space.border,
    ...shadow,
  },
  amountText: {
    fontWeight: "bold",
  },
  btnUpdateText: {
    ...defaultText,
    color: "#fff",
  },
  btnUpdateIcon: {
    color: "#fff",
    fontSize: scale(20),
    marginRight: scale(10),
  },
});

export default injectIntl(FundList);
