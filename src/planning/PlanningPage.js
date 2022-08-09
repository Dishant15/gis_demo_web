import React from "react";
import { useSelector } from "react-redux";

import { Typography } from "@mui/material";

import ComingSoon from "components/common/ComingSoon";
import ActionBar from "./ActionBar";

import { getIsSuperAdminUser } from "redux/selectors/auth.selectors";
import { getContentHeight } from "redux/selectors/appState.selectors";

import "./styles/planning-page.scss";

const PlanningPage = () => {
  return (
    <div id="planning-page" className="page-wrapper">
      <div className="pl-sidebar-wrapper">
        <div className="pl-sidebar">
          <ActionBar />
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
