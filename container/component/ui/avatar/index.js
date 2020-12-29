import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Spinner } from "native-base";
import {
  scale,
  color,
  fontSize,
  defaultText,
  shadow,
} from "container/variables/common";
import { getAvatarSource } from "container/action/user";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";

const Avatar = (props) => {
  //props
  const { style, size, data } = props;
  const [name, setName] = useState("A");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  //effect
  useEffect(() => {
    if (data) {
      getAvatar();
      if (data.name) setName(data.name[0].toUpperCase());
    }
  }, [data]);
  useEffect(() => {

    getAvatar();
  }, []);

  //#region function - event
  const getAvatar = async () => {
    setLoading(true);
    const url = await getAvatarSource(data);
    if (url) setAvatar(url);
    setLoading(false);
  };

  const getColorByName = (firstLetter) => {
    const colors = ["#30a6d1", "#e32256", "#f36e3a", "#8357c1", "#ef9748"];
    if (/[a-e]/iu.test(firstLetter)) return colors[0];
    if (/[f-i]/iu.test(firstLetter)) return colors[1];
    if (/[j-n]/iu.test(firstLetter)) return colors[2];
    if (/[o-t]/iu.test(firstLetter)) return colors[3];
    if (/[u-z]/iu.test(firstLetter)) return colors[4];
    return colors[0];
  };

  //render
  return (
    <View
      style={[
        styles.container,
        style,
        size ? { width: size, height: size, borderRadius: size / 2 } : null,
        { backgroundColor: getColorByName(name) },
      ]}
    >
      <Text style={[styles.text, size ? { fontSize: size * 0.6 } : null]}>
        {name}
      </Text>

      {avatar ? (
        <Image
          style={[
            styles.avatar,
            size ? { width: size, height: size, borderRadius: size / 2 } : null,
          ]}
          source={{ uri: avatar }}
        />
      ) : null}

      {loading ? (
        <View
          style={[
            styles.loadingBox,
            size ? { width: size, height: size, borderRadius: size / 2 } : null,
          ]}
        >
          <Spinner color="#F7F7F7" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.background,
    ...shadow,
  },
  avatar: {
    position: "absolute",
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  text: {
    ...defaultText,
    color: "#fff",
    fontSize: fontSize.size40,
  },
  loadingBox: {
    position: "absolute",
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Avatar;
