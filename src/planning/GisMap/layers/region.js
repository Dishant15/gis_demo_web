import React from "react";
import { useSelector } from "react-redux";

import { Polygon } from "@react-google-maps/api";

import { getFillColor } from "utils/map.utils";
import { getLayerViewData } from "planning/data/planningGis.selectors";
import { zIndexMapping } from "./common/configuration";

export const LAYER_KEY = "region";

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > LayerKeyMaping.layerKey.ViewLayer
   */
  // get data of region layer
  const regionData = useSelector(getLayerViewData(LAYER_KEY));

  return (
    <>
      {regionData.map((reg) => {
        const { id, coordinates, layer } = reg;
        const color = getFillColor(layer);

        const multiPolygons = coordinates.map((polyCoord, ind) => {
          return (
            <Polygon
              key={ind}
              options={{
                fillOpacity: 0,
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: false,
                geodesic: false,
                zIndex: zIndexMapping[LAYER_KEY],
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
