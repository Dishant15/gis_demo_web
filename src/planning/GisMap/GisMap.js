import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import isNull from "lodash/isNull";

import Box from "@mui/material/Box";

import Map from "components/common/Map";
import TicketMapLayers from "planning/TicketContent/components/TicketMapLayers";
import GisMapEventLayer from "./components/GisMapEventLayer";

import { getSelectedLayerKeys } from "planning/data/planningState.selectors";
import { LayerKeyMappings } from "./utils";
import GisMapViewLayer from "./components/GisMapViewLayer";

const GisMap = React.memo(({ ticketId }) => {
  const mapCenter = undefined;

  return (
    <Box width="100%" height="100%">
      <Map center={mapCenter}>
        <GisMapEventLayer />
        {!isNull(ticketId) ? <TicketMapLayers /> : null}
        <GisMapViewLayer />
      </Map>
    </Box>
  );
});

export default GisMap;
