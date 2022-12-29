import React from "react";
import { Polyline } from "@react-google-maps/api";

import { zIndexMapping } from "planning/GisMap/layers/common/configuration";

const HIGHLIGHT_COLOR = "#446eca";
const dashlineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
};

const SymbolPolyline = ({ coordinates }) => {
  return (
    <Polyline
      path={coordinates}
      zIndex={zIndexMapping.highlighted + 1}
      options={{
        strokeColor: HIGHLIGHT_COLOR,
        strokeOpacity: 0,
        strokeWeight: 4,
        geodesic: true,
        icons: [
          {
            icon: {
              path: 4.0,
              strokeOpacity: 1,
            },
            offset: "0%",
          },
          {
            icon: {
              path: 0.0,
              strokeOpacity: 1,
            },
            offset: "100%",
          },
          {
            icon: dashlineSymbol,
            offset: "10px",
            repeat: "20px",
          },
        ],
      }}
    />
  );
};

export default SymbolPolyline;
