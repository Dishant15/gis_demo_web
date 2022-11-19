import React from "react";
import { useSelector } from "react-redux";

import isNull from "lodash/isNull";

import Box from "@mui/material/Box";

import Map from "components/common/Map";
import TicketMapLayers from "planning/TicketContent/components/TicketMapLayers";
import GisMapEventLayer from "./components/GisMapEventLayer";
import GisMapViewLayer from "./components/GisMapViewLayer";

import { getPlanningMapProps } from "planning/data/planningGis.selectors";

const GisMap = React.memo(({ ticketId }) => {
  const { center, zoom } = useSelector(getPlanningMapProps);

  return (
    <Box width="100%" height="100%">
      <Map center={center} zoom={zoom}>
        <GisMapEventLayer />
        <GisMapViewLayer />
        {!isNull(ticketId) ? <TicketMapLayers /> : null}
      </Map>
    </Box>
  );
});

export default GisMap;
