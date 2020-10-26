import React, { useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { postRequest } from "container/utils/request";
import Config from "container/config/server.config";
import InputItem from "container/component/ui/inputItem";
import { scale, color, fontSize } from "container/variables/common";

const { width } = Dimensions.get("window");

const LAYOUT_SIZE = width - scale(120);
const TITLE_X = (LAYOUT_SIZE - scale(200)) / 2 - scale(15);

const InformationPage = (props) => {
  const { style } = props;

  const [clubName, setClubName] = useState(null);
  const [clubCode, setClubCode] = useState(null);
  const [phone, setPhone] = useState(null);
  const [adminName, setAdminName] = useState(null);
  const [slideAnimation, setSlideAnimation] = useState({
    active: 0,
    titleX: new Animated.Value(0),
    titleSize: 0,
    translateXTabOne: new Animated.Value(0),
    translateXTabTwo: new Animated.Value(LAYOUT_SIZE),
  });

  const {
    active,
    translateXTabOne,
    translateXTabTwo,
    titleX,
    titleSize,
  } = slideAnimation;

  const handleSlide = async () => {
    if (active === 0) {
      console.log("handleSlide::::", translateXTabOne);
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -LAYOUT_SIZE,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: -LAYOUT_SIZE,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(titleX, {
          toValue: scale(230),
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    }

    await setSlideAnimation({ ...slideAnimation, active: active ? 0 : 1 });
  };

  const doSignUp = () => {
    let params = {};
    if (clubName) params.club_name = clubName;
    if (clubCode) params.code = clubCode;
    if (phone) params.phone = phone;
    if (adminName) params.mem_name = adminName;

    console.log("doSignUp:::", params);

    postRequest(Config.API_URL.concat("auth/sign-up"), params)
      .then((res) => {
        if (res) {
          console.log("doSignUp:::", res);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={[style, styles.container]}>
      <View>
        <View style={styles.progress}>
          <View
            style={[
              styles.circle,
              { backgroundColor: active != 0 ? "#CCCCCC" : "#37CE27" },
            ]}
          />
          <View style={[styles.line]} />
          <View
            style={[
              styles.circle,
              { backgroundColor: active == 0 ? "#CCCCCC" : "#37CE27" },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.title,
            {
              left: TITLE_X - titleSize / 2,
              transform: [{ translateX: titleX }],
            },
          ]}
          onLayout={(event) =>
            setSlideAnimation({
              ...slideAnimation,
              titleSize: event.nativeEvent.layout.width,
            })
          }
        >
          <Text
            style={{
              fontSize: fontSize.size32,
              color: color.fontColor,
              fontWeight: "bold",
            }}
          >
            Club's Info
          </Text>
          <View style={styles.miniCircle} />
        </Animated.View>
      </View>

      <ScrollView>
        <View style={{ flexDirection: "row" }}>
          <Animated.View
            style={{
              width: "100%",
              transform: [
                {
                  translateX: translateXTabOne,
                },
              ],
            }}
            onLayout={(event) =>
              setSlideAnimation({
                ...slideAnimation,
                xTabOne: event.nativeEvent.layout.x,
              })
            }
          >
            <InputItem
              style={styles.input}
              placeholder={"Club name"}
              onChangeText={(text) => setClubName(text)}
              value={clubName}
            />

            <InputItem
              placeholder={"Club code"}
              onChangeText={(code) => setClubCode(code)}
              value={clubCode}
            />
          </Animated.View>

          <Animated.View
            style={{
              width: "100%",
              transform: [
                {
                  translateX: translateXTabTwo,
                },
              ],
            }}
            onLayout={(event) =>
              setSlideAnimation({
                ...slideAnimation,
                xTabTwo: event.nativeEvent.layout.x,
              })
            }
          >
            <InputItem
              style={styles.input}
              placeholder={"Admin name"}
              onChangeText={(text) => setAdminName(text)}
              value={adminName}
            />

            <InputItem
              placeholder={"Phone"}
              onChangeText={(code) => setPhone(code)}
              value={phone}
            />
          </Animated.View>
        </View>
      </ScrollView>

      {active == 0 ? (
        <TouchableOpacity style={styles.button} onPress={() => handleSlide()}>
          <Text style={{ color: "#fff", fontSize: fontSize.size28 }}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2AC79C" }]}
          onPress={() => doSignUp()}
        >
          <Text style={{ color: "#fff", fontSize: fontSize.size28 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.signIn}>
        <Text
          style={{
            color: color.fontColor,
            fontSize: fontSize.size28,
            fontWeight: "bold",
          }}
        >
          Have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              color: color.background,
              fontSize: fontSize.size28,
              fontWeight: "bold",
            }}
          >
            Sign in now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  input: {
    marginBottom: scale(40),
  },
  button: {
    flexDirection: "row",
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: color.background,
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(80),
  },
  progress: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(100),
  },
  circle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
  },
  line: {
    width: scale(200),
    borderWidth: scale(2),
    borderColor: "#DEAEAE",
  },
  title: {
    position: "absolute",
    left: 0,
    top: scale(-80),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(15),
  },
  miniCircle: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(15),
    backgroundColor: "#9A41AB",
    marginTop: scale(10),
  },
  signIn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(100),
  },
});

export default InformationPage;