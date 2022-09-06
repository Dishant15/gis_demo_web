import React from "react";
import { useSelector } from "react-redux";

import { getPlanningTicketData } from "planning/data/planningGis.selectors";
import { getGeometryFromKey } from "planning/GisMap/utils";

const TicketMapLayers = React.memo(() => {
  const { work_orders = [] } = useSelector(getPlanningTicketData);

  return (
    <>
      {work_orders.map((workOrder) => {
        const { id, layer_key, element } = workOrder;
        if (element.id) {
          return getGeometryFromKey(id, layer_key, element.coordinates);
        }
      })}
    </>
  );
});

export default TicketMapLayers;
