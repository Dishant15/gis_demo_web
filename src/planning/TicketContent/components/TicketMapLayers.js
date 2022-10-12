import React from "react";
import { useSelector } from "react-redux";

import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";
import { Polygon } from "@react-google-maps/api";

const TicketMapLayers = React.memo(() => {
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
        if (element.id) {
          const GeometryComponent = LayerKeyMappings[layer_key]["Geometry"];
          return <GeometryComponent key={id} {...element} />;
        }
      })}
    </>
  );
});

export default TicketMapLayers;
