import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import ListTask from "./component/list";
import DetailTask from "./component/detail";
import { scale, shadow, color } from "container/variables/common";
import { Icon } from "native-base";
import { injectIntl } from "react-intl";
import ActionButton from "container/component/ui/actionButton";
import CreateTask from "./component/create";
import Messages from "container/translation/Message";
import { Navigation } from "react-native-navigation";

const TabTask = (props) => {
  const { intl, componentId } = props;
  //state

  //variables
  const createTaskRef = useRef(null);
  const detailTaskRef = useRef(null);

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      layout: {
        componentBackgroundColor: color.background,
      },
    });
    if (props.mode) {
      switch (props.mode) {
        case "detail":
          openDetailPopUp();
          break;
        case "create":
          openCreatePopUp();
          break;
      }
    }
  }, []);

  //effect
  useEffect(() => {
    console.log("TabTask::::useEffect", props);

    if (props.mode) {
      switch (props.mode) {
        case "detail":
          openDetailPopUp();
          break;
        case "create":
          openCreatePopUp();
          break;
      }
    }
  }, [props.mode]);

  //function -------------------------------------------------------------------------------------
  const openCreatePopUp = () => {
    createTaskRef.current && createTaskRef.current.show(props.passData);
  };

  const openDetailPopUp = () => {
    detailTaskRef.current && detailTaskRef.current.show(props.data);
  };

  //render ----------------------------------------------------------------------------------------

  const renderContent = () => {
    return (
      <React.Fragment>
        <ListTask openDetail={() => openDetailPopUp()} />
        <CreateTask ref={createTaskRef} {...props} />
        <ActionButton
          title={intl.formatMessage(Messages.add)}
          style={styles.actionButtonBox}
          icon={
            <Icon name="plus" type="Entypo" style={styles.actionButtonIcon} />
          }
          fontStyle={styles.actionButtonText}
          onPress={() => openCreatePopUp()}
        />
        <DetailTask
          ref={detailTaskRef}
          openDetail={() => openDetailPopUp()}
          {...props}
        />
      </React.Fragment>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    ...shadow,
  },
  actionButtonBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: scale(15),
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButtonText: {
    
    color: "#fff",
  },
  actionButtonIcon: {
    fontSize: scale(30),
    color: "#fff",
  },
});

export default injectIntl(TabTask);
