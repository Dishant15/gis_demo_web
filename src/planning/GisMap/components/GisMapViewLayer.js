import React, { memo } from "react";
import { useSelector } from "react-redux";

import { Polyline, Marker, Polygon } from "@react-google-maps/api";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { getSelectedLayerKeys } from "planning/data/planningState.selectors";

import { LayerKeyMappings } from "../utils";
import { FEATURE_TYPES, zIndexMapping } from "../layers/common/configuration";

/**
 * Parent:
 *    GisMap
 */
const GisMapViewLayer = () => {
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

  switch (featureType) {
    case FEATURE_TYPES.POINT:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <Marker
            key={id}
            icon={{
              // add default icon here
              url: viewOptions.icon,
            }}
            zIndex={zIndexMapping[layerKey]}
            position={coordinates}
          />
        );
      });

    case FEATURE_TYPES.MULTI_POLYGON:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <React.Fragment key={id}>
            {coordinates.map((polyCoord, ind) => {
              return (
                <Polygon
                  key={ind}
                  options={{
                    ...viewOptions,
                    zIndex: zIndexMapping[layerKey],
                  }}
                  paths={polyCoord}
                />
              );
            })}
          </React.Fragment>
        );
      });

    case FEATURE_TYPES.POLYGON:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <Polygon
            key={id}
            options={{
              ...viewOptions,
              zIndex: zIndexMapping[layerKey],
            }}
            paths={coordinates}
          />
        );
      });

    case FEATURE_TYPES.POLYLINE:
      return layerData.map((element) => {
        const { id, hidden, coordinates } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <Polyline
            key={id}
            options={{
              ...viewOptions,
              zIndex: zIndexMapping[layerKey],
            }}
            path={coordinates}
          />
        );
      });
    default:
      return null;
  }
};

export default memo(GisMapViewLayer);
