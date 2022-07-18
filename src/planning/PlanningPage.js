import React, { useState } from "react";

import {
  Box,
  Divider,
  Stack,
  Button,
  Typography,
  Collapse,
} from "@mui/material";
import { useSelector } from "react-redux";

import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ComingSoon from "components/common/ComingSoon";

import { getIsSuperAdminUser } from "redux/selectors/auth.selectors";
import { getContentHeight } from "redux/selectors/appState.selectors";

import "./styles/planning-page.scss";

const PlanningPage = () => {
  const [showRegions, setShowRegions] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  return (
    <div id="planning-page" className="page-wrapper">
      <div className="pl-content-wrapper">
        <div className="pl-pocket-list">
          <div className="pl-list-wrapper">
            <Stack
              px={2}
              direction="row"
              onClick={() => setShowRegions((reg) => !reg)}
            >
              <Box
                color="primary.dark"
                flex={1}
                className="reg-list-header-pill"
              >
                Regions
              </Box>
              <Button color="success" startIcon={<ManageSearchIcon />}>
                search
              </Button>
            </Stack>
            <Divider flexItem orientation="horizontal" />

            <Collapse in={showRegions}>
              <Box className="reg-list-pill">Region 1</Box>
              <Box className="reg-list-pill">Region 2</Box>
              <Box className="reg-list-pill">Region 3</Box>
            </Collapse>

            <Stack
              mt={5}
              px={2}
              direction="row"
              onClick={() => setShowLayers((lay) => !lay)}
            >
              <Box
                color="primary.dark"
                flex={1}
                className="reg-list-header-pill"
              >
                GIS Layers
              </Box>
              <Button color="success" startIcon={<ManageSearchIcon />}>
                search
              </Button>
            </Stack>
            <Divider flexItem orientation="horizontal" />

            <Collapse in={showLayers}>
              <Box className="reg-list-pill">Survey Boundary</Box>
              <Box className="reg-list-pill">Survey Buildings</Box>
              <Box className="reg-list-pill">Primary Splitters</Box>
              <Box className="reg-list-pill">Secondary Splitters</Box>
              <Box className="reg-list-pill">Cabel</Box>
            </Collapse>
          </div>
        </div>

        <div className="pl-content">
          <div className="pl-map-container">
            <Typography variant="h2" textAlign="center">
              Google Map
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanningPageWrapper = () => {
  const isSuperAdmin = useSelector(getIsSuperAdminUser);
  const contentHeight = useSelector(getContentHeight);

  if (isSuperAdmin) {
    return <PlanningPage />;
  } else {
    return <ComingSoon contentHeight={contentHeight} />;
  }
};

export default PlanningPageWrapper;
