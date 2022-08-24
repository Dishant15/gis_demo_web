import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Divider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LayersIcon from "@mui/icons-material/Layers";
import AddLocationIcon from "@mui/icons-material/AddLocation";

import RegionTabContent from "./components/RegionTabContent";
import LayersTabContent from "./components/LayersTabContent";

import { setActiveTab } from "planning/data/planningState.reducer";
import { getActiveTab } from "planning/data/planningState.selectors";
import AddElementContent from "./components/AddElementContent";

const ActionBarWrapper = () => {
  /**
   * Parent for sidebar on planning component
   * manage selected tab states
   */
  const dispatch = useDispatch();
  const activeTab = useSelector(getActiveTab);

  const handleTabChange = useCallback((_, newValue) => {
    dispatch(setActiveTab(newValue));
  }, []);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 0:
        return <RegionTabContent />;

      case 1:
        return <LayersTabContent />;

      case 2:
        return <AddElementContent />;

      default:
        return <div>Invalid Tab Selection</div>;
    }
  }, [activeTab]);

  return (
    <div className="pl-list-wrapper">
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="icon label tabs example"
        className="pl-list-tabs"
      >
        <Tab icon={<AttractionsIcon />} label="Region" />
        <Tab icon={<LayersIcon />} label="GIS Layers" />
        <Tab icon={<AddLocationIcon />} label="Add Element" />
      </Tabs>
      <Divider flexItem orientation="horizontal" />
      <Box className="pl-list-tab-content">{tabContent}</Box>
    </div>
  );
};

export default ActionBarWrapper;
