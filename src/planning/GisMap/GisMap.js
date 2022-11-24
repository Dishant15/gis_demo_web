import React from "react";
import { useSelector } from "react-redux";

import isNull from "lodash/isNull";

import Box from "@mui/material/Box";

import Map from "components/common/Map";
import TicketMapViewLayers from "planning/TicketContent/components/TicketMapViewLayers";
import GisMapEventLayer from "./components/GisMapEventLayer";
import GisMapViewLayer from "./components/GisMapViewLayer";
import MapActionBar from "./components/MapActionBar";

import { getPlanningMapPosition } from "planning/data/planningGis.selectors";

const GisMap = React.memo(({ ticketId }) => {
  const { center, zoom } = useSelector(getPlanningMapPosition);

  return (
    <Box width="100%" height="100%">
      <Map center={center} zoom={zoom}>
        <GisMapEventLayer />
        <GisMapViewLayer />
        {!isNull(ticketId) ? <TicketMapViewLayers /> : null}
      </Map>
      <MapActionBar />
    </Box>
  );
});

export default GisMap;
