import React from "react";
import { Link } from "react-router-dom";
import {
  getAreaPocketPath,
  getGeoSurveyPath,
  getHomePath,
} from "../../utils/url.constants";

import "./navigation-bar.scss";

const NavigationBar = () => {
  return (
    <div id="navigation-bar">
      <div className="nav-link-wrapper">
        <Link className="nav-link" to={getHomePath()}>
          Home
        </Link>
        <Link className="nav-link" to={getAreaPocketPath()}>
          Area Pockets
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
