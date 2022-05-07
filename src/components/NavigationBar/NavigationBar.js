import React from "react";
import { Link } from "react-router-dom";
import { getHomePath } from "../../utils/url.constants";

import "./navigation-bar.scss";

const NavigationBar = () => {
  return (
    <div id="navigation-bar">
      <div className="nav-link-wrapper">
        <Link to={getHomePath()}>Home</Link>
        <Link to={"/survey"}>Survey</Link>
      </div>
    </div>
  );
};

export default NavigationBar;
