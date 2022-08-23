import React from "react";

import ActionBar from "./ActionBar";
import GisMap from "./GisMap";

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
            <GisMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
