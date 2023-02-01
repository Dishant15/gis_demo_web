import React from "react";

import GTPL_LOGO from "assets/gtpl.jpeg";
import GPS_LOGO from "assets/gpstek.svg";

export default function NavLogo() {
  if (window.location.host === "gis.gtpl.net") {
    return <img src={GTPL_LOGO} className="logo" />;
  } else {
    return (
      <img
        src={GPS_LOGO}
        className="logo"
        style={{
          width: "140px",
        }}
      />
    );
  }
}
