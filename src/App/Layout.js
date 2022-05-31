import React from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "components/NavigationBar";
import Notification from "components/common/Notification";

const Layout = () => {
  return (
    <div id="layout">
      <NavigationBar />
      <Outlet />
      <Notification />
    </div>
  );
};

export default Layout;
