import React from "react";
import { useSelector } from "react-redux";

import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";

const TicketMapLayers = React.memo(() => {
  const { work_orders = [] } = useSelector(getPlanningTicketData);

  return (
    <>
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
