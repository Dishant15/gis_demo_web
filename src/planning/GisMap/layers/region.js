import React from "react";

import { Polygon } from "@react-google-maps/api";

import { getFillColor } from "utils/map.utils";
import { useSelector } from "react-redux";
import { getLayerViewData } from "planning/data/planningGis.selectors";

const LAYER_KEY = "region";

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  // get data of region layer
  const regionData = useSelector(getLayerViewData("region"));
  const regionList = regionData.viewData;

  return (
    <>
      {regionList.map((reg) => {
        const { id, coordinates, layer } = reg;
        const color = getFillColor(layer);

        const multiPolygons = coordinates.map((polyCoord, ind) => {
          return (
            <Polygon
              key={ind}
              options={{
                // fillColor: color,
                // fillOpacity: 0.3,
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: false,
                geodesic: false,
                zIndex: 1,
              }}
              paths={polyCoord}
            />
          );
        });

        return <React.Fragment key={id}>{multiPolygons}</React.Fragment>;
      })}
    </>
  );
};
