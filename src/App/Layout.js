import React from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "components/NavigationBar";
import Notification from "components/common/Notification";
import WaterMark from "components/common/WaterMark";

const Layout = () => {
  return (
    <div id="layout">
      <NavigationBar />
      <Outlet />
      <Notification />
      <WaterMark />
    </div>
  );
};

export default Layout;
