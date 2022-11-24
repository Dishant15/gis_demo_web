import React from "react";
import { useSelector } from "react-redux";

import { Polyline, Marker, Polygon } from "@react-google-maps/api";

import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";
import {
  FEATURE_TYPES,
  zIndexMapping,
} from "planning/GisMap/layers/common/configuration";

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
        const { id, layer_key, element } = workOrder;
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
                />
              );

            case FEATURE_TYPES.POLYGON:
              return (
                <Polygon
                  key={id}
                  options={{
                    ...viewOptions,
                    zIndex: zIndexMapping[layer_key],
                  }}
                  paths={element.coordinates}
                />
              );

            case FEATURE_TYPES.POLYLINE:
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

            default:
              return null;
          }
        }
      })}
    </>
  );
});

export default TicketMapViewLayers;
