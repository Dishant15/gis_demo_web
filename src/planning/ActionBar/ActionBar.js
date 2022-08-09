import React, { useCallback, useMemo } from "react";

import { Box, Divider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LayersIcon from "@mui/icons-material/Layers";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "planning/data/planningState.reducer";
import { getActiveTab } from "planning/data/planningState.selectors";
import RegionTabContent from "./components/RegionTabContent";

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
        return <div>Layers</div>;

      case 2:
        return <div>Add Element Blocks</div>;

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
      >
        <Tab icon={<AttractionsIcon />} label="Region" />
        <Tab icon={<LayersIcon />} label="GIS Layers" />
        <Tab icon={<AddLocationIcon />} label="Add Element" />
      </Tabs>
      <Divider flexItem orientation="horizontal" />
      <Box>{tabContent}</Box>
    </div>
  );
};

export default ActionBarWrapper;
