import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import isNull from "lodash/isNull";

import Box from "@mui/material/Box";

import Map from "components/common/Map";
import TicketMapViewLayers from "planning/TicketContent/components/TicketMapViewLayers";
import GisMapEventLayer from "./components/GisMapEventLayer";
import GisMapViewLayer from "./components/GisMapViewLayer";
import GisMapSpecialLayer from "./components/GisMapSpecialLayer";
import MapActionBar from "./components/MapActionBar";

import { getPlanningMapPosition } from "planning/data/planningGis.selectors";
import { onGisMapClick } from "planning/data/planning.actions";
import MapSearchbox from "./components/MapSearchbox";

const GisMap = React.memo(({ ticketId }) => {
  const dispatch = useDispatch();
  const { center, zoom } = useSelector(getPlanningMapPosition);

  const handleMapClick = useCallback((mapMouseEvent) => {
    dispatch(onGisMapClick(mapMouseEvent));
  }, []);

  return (
    <Box width="100%" height="100%">
      <Map center={center} zoom={zoom} onClick={handleMapClick}>
        <MapSearchbox />
        {/* show gis map popups and other info table/forms as per events */}
        <GisMapEventLayer />
        {/* show gis map common layer elements as user selects them */}
        <GisMapViewLayer />
        {isNull(ticketId) ? null : <TicketMapViewLayers />}
        {/* handle gis map special events */}
        <GisMapSpecialLayer />
      </Map>
      <MapActionBar />
    </Box>
  );
});

export default GisMap;
