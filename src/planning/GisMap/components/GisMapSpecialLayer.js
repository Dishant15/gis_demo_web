import { useSelector } from "react-redux";
import React from "react";
import { Polygon } from "@react-google-maps/api";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { PLANNING_EVENT } from "../utils";
import { zIndexMapping } from "../layers/common/configuration";

const GisMapSpecialLayer = () => {
  const { event, data } = useSelector(getPlanningMapState);

  if (event === PLANNING_EVENT.listElementsOnMap) {
    return (
      <Polygon
        options={{
          strokeColor: "yellow",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "yellow",
          fillOpacity: 0.3,
          clickable: false,
          draggable: false,
          editable: false,
          zIndex: zIndexMapping.highlighted,
        }}
        paths={data.filterCoords}
      />
    );
  } else {
    return null;
  }
};

export default GisMapSpecialLayer;
