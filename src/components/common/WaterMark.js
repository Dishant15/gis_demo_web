import React from "react";
import LOGO from "assets/gpstek.svg";

import "./watermark.scss";
import { Typography } from "@mui/material";

const WaterMark = () => {
  return (
    <div className="watermark">
      <Typography align="center" variant="subtitle2" color="text.secondary">
        Powered By
      </Typography>
      <div>
        <img src={LOGO} className="logo" />
      </div>
    </div>
  );
};

export default WaterMark;
