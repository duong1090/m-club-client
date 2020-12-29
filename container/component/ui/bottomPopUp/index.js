import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { scale, space, shadow } from "container/variables/common";
import Interactable from "react-native-interactable";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

const BottomPopUp = (props, ref) => {
  const {
    height,
    animateToY,
    limitAnimateY,
    bodyStyle,
    body,
    isUseKeyBoard,
    callBackClose,
    toolbar,
  } = props;

  //state
  const [visible, setVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  //variables
  const interactableRef = useRef(null);
  let _deltaX = new Animated.Value(0);
  let _deltaY = new Animated.Value(Screen.height + height);

  //effect
  useEffect(() => {
    if (isUseKeyBoard) {
      Keyboard.addListener("keyboardWillShow", onKeyboardDidShow);
      Keyboard.addListener("keyboardWillHide", onKeyboardDidHide);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      console.log("interactableRef:::", interactableRef);
      interactableRef.current && interactableRef.current.snapTo({ index: 0 });
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //function - event
  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    console.log("hide:::popup");
    setVisible(false);
    Keyboard.dismiss();
    callBackClose && callBackClose();
  };

  const onKeyboardDidShow = (e) => {
    if (e.endCoordinates.height < 400)
      setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = (e) => {
    setKeyboardHeight(0);
  };

  const onDragPanel = (e) => {
    const { state, x, y, targetSnapPointId } = e.nativeEvent;
    if (state === "end" && targetSnapPointId === "hide") {
      hide();
    }
  };

  //render
  const renderNonKeyBoard = () => {
    return (
      visible && (
        <View style={styles.panelContainer} pointerEvents="box-none">
          <AnimatedTouchable
            onPress={() => hide()}
            style={[
              styles.panelContainer,
              {
                backgroundColor: "black",
                opacity: _deltaY.interpolate({
                  inputRange: [0, Screen.height + height],
                  outputRange: [0.5, 0],
                  extrapolateRight: "clamp",
                }),
              },
            ]}
          />
          <Interactable.View
            ref={interactableRef}
            verticalOnly
            snapPoints={[
              { y: Screen.height + animateToY },
              { y: Screen.height + height },
            ]}
            boundaries={{ top: limitAnimateY }}
            initialPosition={{ y: Screen.height + height }}
            animatedValueX={_deltaX}
            animatedValueY={_deltaY}
          >
            <View style={styles.panel}>
              {/* action line to move this panel */}
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>
              <View style={[styles.panelBody, bodyStyle]}>{body}</View>
            </View>
          </Interactable.View>
          {toolbar ? (
            <View style={[styles.toolbar]}>
              <View style={styles.toolbarItem} />
              {toolbar()}
            </View>
          ) : null}
        </View>
      )
    );
  };

  const renderWithKeyBoard = () => {
    return (
      visible && (
        <View style={styles.panelContainer} pointerEvents="box-none">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={50}
            behavior="position"
          >
            <AnimatedTouchable
              pointerEvents={"box-none"}
              onPress={() => hide()}
              style={[
                styles.panelContainer,
                {
                  backgroundColor: "black",
                  height: Screen.height - height,
                  opacity: _deltaY.interpolate({
                    inputRange: [0, Screen.height - 100],
                    outputRange: [0.5, 0],
                    extrapolateRight: "clamp",
                  }),
                },
              ]}
            />
            <Interactable.View
              ref={interactableRef}
              verticalOnly
              startOnFront
              dragEnabled
              onDrag={onDragPanel}
              snapPoints={[
                { y: Screen.height + animateToY },
                { y: Screen.height + height },
              ]}
              boundaries={{ top: limitAnimateY }}
              initialPosition={{ y: Screen.height - height }}
              animatedValueX={_deltaX}
              animatedValueY={_deltaY}
            >
              <View style={styles.panel}>
                {/* action line to move this panel */}
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                </View>
                <View style={[styles.panelBody, bodyStyle]}>{body}</View>
              </View>
            </Interactable.View>
          </KeyboardAvoidingView>

          {toolbar ? (
            <View style={[styles.toolbar]}>
              <View style={styles.toolbarItem} />
              {toolbar()}
            </View>
          ) : null}
        </View>
      )
    );
  };

  return (
    <React.Fragment>
      {isUseKeyBoard ? renderWithKeyBoard() : renderNonKeyBoard()}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: Screen.height,
    padding: space.bgPadding,
    backgroundColor: "#fff",
    borderTopLeftRadius: space.border,
    borderTopRightRadius: space.border,
    ...shadow,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 30,
    height: 3,
    borderRadius: 4,
    backgroundColor: "#00000030",
    marginBottom: scale(30),
  },
  panelBody: {
    alignItems: "center",
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    //height: 40,
    paddingHorizontal: space.bgPadding,
    paddingVertical: space.bgPadding / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default forwardRef(BottomPopUp);
