import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";

import { Polyline, Marker, Polygon } from "@react-google-maps/api";

import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";
import {
  FEATURE_TYPES,
  zIndexMapping,
} from "planning/GisMap/layers/common/configuration";

const COMMON_POLYGON_OPTIONS = {
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.3,
  clickable: false,
  draggable: false,
  editable: false,
};

const TicketMapViewLayers = React.memo(() => {
  const { work_orders = [], area_pocket } = useSelector(getPlanningTicketData);

  return (
    <>
      {area_pocket?.coordinates ? (
        <Polygon
          path={area_pocket.coordinates}
          options={{
            strokeColor: "#88B14B",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#88B14B",
            fillOpacity: 0.3,
            clickable: false,
            draggable: false,
            editable: false,
            zIndex: 1,
          }}
        />
      ) : null}
      {work_orders.map((workOrder) => {
        const { id, layer_key, element, highlighted } = workOrder;
        if (id) {
          const featureType = LayerKeyMappings[layer_key]["featureType"];
          const viewOptions =
            LayerKeyMappings[layer_key]["getViewOptions"](element);

          switch (featureType) {
            case FEATURE_TYPES.POINT:
              return (
                <Marker
                  key={id}
                  icon={{
                    // add default icon here
                    url: viewOptions.icon,
                  }}
                  zIndex={zIndexMapping[layer_key]}
                  position={element.coordinates}
                  animation={highlighted ? 1 : null}
                />
              );

            case FEATURE_TYPES.POLYGON:
              return (
                <Fragment key={id}>
                  <Polygon
                    options={{
                      ...COMMON_POLYGON_OPTIONS,
                      ...viewOptions,
                      zIndex: zIndexMapping[layer_key],
                    }}
                    paths={element.coordinates}
                  />
                  <AnimatedPolyline coordinates={element.coordinates} />
                </Fragment>
              );

            case FEATURE_TYPES.POLYLINE:
              if (highlighted) {
                return (
                  <AnimatedPolyline
                    key={id}
                    coordinates={element.coordinates}
                  />
                );
              } else {
                return (
                  <Polyline
                    key={id}
                    options={{
                      ...viewOptions,
                      zIndex: zIndexMapping[layer_key],
                    }}
                    path={element.coordinates}
                  />
                );
              }

            default:
              return null;
          }
        }
      })}
    </>
  );
});

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

export default TicketMapViewLayers;
