import React, { memo, Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Polyline, Marker, Polygon } from "@react-google-maps/api";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { getSelectedLayerKeys } from "planning/data/planningState.selectors";

import { LayerKeyMappings } from "../utils";
import { FEATURE_TYPES, zIndexMapping } from "../layers/common/configuration";

const COMMON_POLYGON_OPTIONS = {
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.3,
  clickable: false,
  draggable: false,
  editable: false,
};
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
        const { id, hidden, coordinates, highlighted } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <Marker
            key={id}
            clickable={false}
            icon={{
              // add default icon here
              url: viewOptions.icon,
              anchor: { x: 14, y: 24 },
            }}
            zIndex={
              highlighted ? zIndexMapping.highlighted : zIndexMapping[layerKey]
            }
            position={coordinates}
            animation={highlighted ? 1 : null}
          />
        );
      });

    case FEATURE_TYPES.MULTI_POLYGON:
      return layerData.map((element) => {
        const { id, hidden, coordinates, highlighted } = element;
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
                    ...(highlighted
                      ? {
                          strokeColor: HIGHLIGHT_COLOR,
                          strokeOpacity: 1,
                          strokeWeight: 4,
                        }
                      : {}),
                    zIndex: highlighted
                      ? zIndexMapping.highlighted
                      : zIndexMapping[layerKey],
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
        const { id, hidden, coordinates, highlighted } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        return (
          <Fragment key={id}>
            <Polygon
              options={{
                ...COMMON_POLYGON_OPTIONS,
                ...viewOptions,
                ...(highlighted
                  ? {
                      strokeOpacity: 0,
                      strokeWeight: 0,
                    }
                  : {}),
                zIndex: highlighted
                  ? zIndexMapping.highlighted
                  : zIndexMapping[layerKey],
              }}
              paths={coordinates}
            />
            {highlighted ? (
              <AnimatedPolyline coordinates={coordinates} />
            ) : null}
          </Fragment>
        );
      });

    case FEATURE_TYPES.POLYLINE:
      return layerData.map((element) => {
        const { id, hidden, coordinates, highlighted } = element;
        const viewOptions =
          LayerKeyMappings[layerKey]["getViewOptions"](element);

        if (hidden) return null;

        if (highlighted) {
          return <AnimatedPolyline key={id} coordinates={coordinates} />;
        } else {
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
        }
      });
    default:
      return null;
  }
};

export default memo(GisMapViewLayer);

const HIGHLIGHT_COLOR = "#446eca";
const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  // scale: 4, // default scale is handle from polyline strokeWeight
};

const AnimatedPolyline = ({ coordinates }) => {
  const [offset, setOffset] = useState("0px");
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (offset === "0px") {
  //       setOffset("20px");
  //     } else {
  //       setOffset("0px");
  //     }
  //   }, 1000); // in milliseconds
  //   return () => clearInterval(intervalId);
  // }, [offset]);
  const options = {
    strokeColor: HIGHLIGHT_COLOR,
    strokeOpacity: 0,
    strokeWeight: 4,
    geodesic: true,
    icons: [
      {
        icon: lineSymbol,
        offset: offset,
        repeat: "20px",
      },
    ],
  };
  return (
    <Polyline
      key={offset}
      path={coordinates}
      zIndex={zIndexMapping.highlighted + 1}
      options={options}
    />
  );
};
