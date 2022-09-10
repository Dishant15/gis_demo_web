import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNull } from "lodash";

import Map from "components/common/Map";
import TicketMapLayers from "planning/TicketContent/components/TicketMapLayers";
import { Box } from "@mui/material";
import GisMapEventLayer from "./components/GisMapEventLayer";

import { getSelectedLayerKeys } from "planning/data/planningState.selectors";
import { LayerKeyMappings } from "./utils";

const GisMap = React.memo(({ ticketId }) => {
  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const mapCenter = undefined;

  const Layers = useMemo(() => {
    return mapLayers.map((layerKey) => {
      const ViewLayerComponent = LayerKeyMappings[layerKey]["ViewLayer"];
      return <ViewLayerComponent key={layerKey} />;
    });
  }, [mapLayers]);

  return (
    <Box width="100%" height="100%">
      <Map center={mapCenter}>
        <GisMapEventLayer />
        {!isNull(ticketId) ? <TicketMapLayers /> : null}
        {Layers}
      </Map>
    </Box>
  );
});

export default GisMap;
