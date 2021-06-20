import React, { useState, useEffect, useRef, useContext } from "react";
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
  
  space,
  shadow,
  fontSize,
} from "container/variables/common";
import { postRequest, getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import ModalContext from 'container/context/modal';
import CreateFund from "./create";
import FundDetail from "./detail";
import { injectIntl } from "react-intl";
import Messages from "container/translation/Message";
import { Icon } from "native-base";
import update from "immutability-helper";
import { normalRole } from "container/constant/role";
import PrivilegeAction from "container/component/ui/privilegeAction";
import ActionButton from "container/component/ui/actionButton";

const FundList = (props) => {
  //props
  const { intl } = props;
  //state
  const [data, setData] = useState([]);
  const [currFund, setCurrFund] = useState(0);
  const [meta, setMeta] = useState({});

  //variables
  const createFundRef = useRef(null);
  const detailFundRef = useRef(null);
  let page = 1;

  //context
  const { showSpinner, hideSpinner } = useContext(ModalContext);

  //effect -------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
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
    getRequest("fund/get", { page })
      .then((res) => {
        if (res && res.data) {
          setData(res.data.items);
          setMeta(res.data.meta);
          setCurrFund(res.data.current_fund);
        }
        hideSpinner();
      })
      .catch((err) => {
        console.error(err);
        hideSpinner();
      });
  };

  const loadMore = () => {
    if (page < meta.total_page) {
      page++;
      getData();
    }
  };

  const updateList = (item) => {
    setCurrFund(
      update(currFund, {
        $set: currFund + [-item.amount, item.amount][item.is_revenue],
      })
    );
    setMeta(meta, { total: { $set: meta.total++ } });
    setData(update(data, { $unshift: [item] }));
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
            <Text style={styles.itemHeaderText}>
              {intl.formatMessage(Messages.activity)}
            </Text>
          </View>
          <View style={[styles.itemMid, styles.headerMid]}>
            <Text style={styles.itemHeaderText}>
              {intl.formatMessage(Messages.reason)}
            </Text>
          </View>
          <View style={[styles.itemRight, styles.headerRight]}>
            <Text style={styles.itemHeaderText}>
              {intl.formatMessage(Messages.amount)}
            </Text>
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
          <Text style={styles.informationTitle}>
            {intl.formatMessage(Messages.current_fund)}
            {":"}
          </Text>
          <Text style={styles.informationText}>{currFund}</Text>
        </View>
        <View style={styles.informationBox}>
          <Text style={styles.informationTitle}>
            {intl.formatMessage(Messages.activities)}
            {":"}
          </Text>
          <Text style={styles.informationText}>{meta.total}</Text>
        </View>
      </View>

      {renderTable()}

      <PrivilegeAction privilegeKey={normalRole.FUND_UPDATE}>
        <ActionButton
          title={intl.formatMessage(Messages.update)}
          style={styles.btnUpdateBox}
          icon={
            <Icon type="FontAwesome5" name="pen" style={styles.btnUpdateIcon} />
          }
          color={color.done}
          onPress={() => openCreateFund()}
        />
      </PrivilegeAction>

      <CreateFund ref={createFundRef} updateCallback={updateList} />
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
    
    fontWeight: "bold",
    marginRight: scale(10),
  },
  informationText: {
    
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
    
    // fontSize: fontSize.sizeContent,
  },
  itemHeaderText: {
    
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
    backgroundColor: color.done,
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
    
    color: "#fff",
  },
  btnUpdateIcon: {
    color: "#fff",
    fontSize: scale(20),
    marginRight: scale(10),
  },
});

export default injectIntl(FundList);
