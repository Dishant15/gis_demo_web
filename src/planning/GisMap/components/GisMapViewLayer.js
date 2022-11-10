import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Polyline, Marker, Polygon } from "@react-google-maps/api";

import {
  getLayerViewData,
  getPlanningMapState,
} from "planning/data/planningGis.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { FEATURE_TYPES, zIndexMapping } from "../layers/common/configuration";
import { get } from "lodash";
import { getSelectedLayerKeys } from "planning/data/planningState.selectors";

const GisMapViewLayer = () => {
  const dispatch = useDispatch();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);

  return mapLayers.map((layerKey) => {
    return <ViewLayer key={layerKey} layerKey={layerKey} />;
  });
};

const ViewLayer = ({ layerKey }) => {
  const layerData = useSelector(getLayerViewData(layerKey));

  // marker | polyline | polygon
  const featureType = LayerKeyMappings[layerKey]["featureType"];
  console.log("🚀 ~ file: layerData", layerKey, layerData, featureType);

  switch (featureType) {
    case FEATURE_TYPES.MARKER:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        if (hidden) return null;
        return (
          <Marker
            key={id}
            zIndex={zIndexMapping[layerKey]}
            position={coordinates}
          />
        );
      });
    case FEATURE_TYPES.POLYGON:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        if (hidden) return null;
        if (layerKey === "region") {
          return coordinates.map((polyCoord, ind) => {
            return (
              <Polygon
                key={ind}
                options={{
                  fillOpacity: 0,
                  // strokeColor: color,
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: false,
                  draggable: false,
                  editable: false,
                  geodesic: false,
                  zIndex: zIndexMapping[layerKey],
                }}
                paths={polyCoord}
              />
            );
          });
        } else {
          return <Polygon key={id} path={coordinates} />;
        }
      });
    case FEATURE_TYPES.POLYLINE:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        if (hidden) return null;
        return <Polyline key={id} path={coordinates} />;
      });
    default:
      return null;
  }
};

export default memo(GisMapViewLayer);
