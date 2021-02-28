import React, { useState, useEffect } from "react";
import { Tabs, Tab, ScrollableTab } from "native-base";

const SlideTab = (props) => {
  //props
  const { tabs } = props;
  //state
  const [activeTab, setActiveTab] = useState(0);

  //effect
  useEffect(() => {
    setActiveTab(props.activeTab);
  }, [props.activeTab]);


  //function
  const onChangeTab = (index) => {
    
  };

  //render
  return (
    <Tabs
      page={activeTab}
      onChangeTab={(e) => onChangeTab(e.i)}
      renderTabBar={() => <ScrollableTab style={{ height: 0 }} />}
    >
      {tabs.map((tab) => (
        <Tab heading="" style={{ backgroundColor: "transparent" }}>
          {tab}
        </Tab>
      ))}
    </Tabs>
  );
};

export default SlideTab;
