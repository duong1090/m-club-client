import { Tabs, Tab, ScrollableTab, Icon } from "native-base";
import React, { useState } from "react";
import FastImage from "react-native-fast-image";
import update from "immutability-helper";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  color,
  scale,
  space,
  fontSize,
  shadow,
} from "container/variables/common";

const width = Dimensions.get("window").width;

const SliderImage = (props) => {
  const { images, onDelete, isDelete } = props;

  const [loading, setLoading] = useState(
    images ? images.map((item) => true) : []
  );
  const [currImage, setCurrImage] = useState(0);

  const renderPagination = () => {
    return (
      <View style={styles.dotBox}>
        {images ? images.map((item, index) => renderDot(index)) : null}
      </View>
    );
  };

  const renderDot = (index) => {
    return index == currImage ? (
      <View style={styles.activeDot} />
    ) : (
      <View style={styles.inactiveDot} />
    );
  };

  const renderDeleteBox = (index) => {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0, 0.5)",
        }}
      >
        <TouchableOpacity
          style={styles.deleteBox}
          onPress={() => {
            onDelete && onDelete(index);
          }}
        >
          <Icon name="trash" style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {images ? (
        <Tabs
          initialPage={0}
          page={currImage}
          prerenderingSiblingsNumber={Infinity}
          renderTabBar={() => (
            <ScrollableTab style={{ height: 0, borderColor: "#fff" }} />
          )}
          onChangeTab={(e) => setCurrImage(e.i)}
        >
          {images.map((item, index) => (
            <Tab heading="" style={{ flex: 1 }}>
              <FastImage
                style={styles.image}
                source={typeof item === "string" ? { uri: item } : item}
                resizeMethod={"resize"}
                resizeMode={"cover"}
                onLoadEnd={() => {
                  let temp = [...loading];
                  temp[index] = false;
                  setLoading(temp);
                }}
              />
              {isDelete ? renderDeleteBox(index) : null}
              {loading[index] ? (
                <ActivityIndicator
                  size="large"
                  color="#E91E63"
                  style={styles.spinner}
                />
              ) : null}
            </Tab>
          ))}
        </Tabs>
      ) : null}
      {images && images.length > 1 ? renderPagination() : null}
    </View>
  );
};

export default SliderImage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: (width * 3) / 4,
  },
  dotBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: scale(30),
  },
  activeDot: {
    width: scale(25),
    height: scale(25),
    marginHorizontal: scale(15),
    borderRadius: scale(13),
    backgroundColor: "#FFEE58",
  },
  inactiveDot: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    marginHorizontal: scale(15),
    backgroundColor: "#90A4AE",
  },
  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  spinner: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  deleteBox: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.background,
  },
  deleteIcon: {
    fontSize: scale(50),
    color: "#fff",
  },
});
