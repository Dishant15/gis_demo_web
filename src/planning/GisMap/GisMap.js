import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNull } from "lodash";

import Map from "components/common/Map";
import TicketMapLayers from "planning/TicketContent/components/TicketMapLayers";
import { Box } from "@mui/material";

import { getSelectedLayerKeys } from "planning/data/planningState.selectors";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { getLayerCompFromKey, LayerKeyMappings } from "./utils";

const GisMap = React.memo(({ ticketId }) => {
  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const mapState = useSelector(getPlanningMapState);
  const mapCenter = undefined;

  const Layers = useMemo(() => {
    return mapLayers.map((layerKey) => {
      return getLayerCompFromKey(layerKey);
    });
  }, [mapLayers]);

  const maybeActivityLayer = useMemo(() => {
    if (!!mapState.event) {
      return LayerKeyMappings[mapState.layerKey][mapState.event];
    }
    return null;
  }, [mapState.event, mapState.layerKey]);

  return (
    <Box width="100%" height="100%">
      <Map center={mapCenter}>
        {maybeActivityLayer}
        {!isNull(ticketId) ? <TicketMapLayers /> : null}
        {Layers}
      </Map>
    </Box>
  );
});

export default GisMap;
