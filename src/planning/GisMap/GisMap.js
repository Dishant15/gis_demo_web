import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";
import Map from "components/common/Map";

import { getSelectedLayerKeys } from "planning/data/planningState.selectors";
import { getLayerCompFromKey } from "./utils";

const GisMap = ({ mapCenter = undefined }) => {
  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);

  const Layers = useMemo(() => {
    return mapLayers.map((layerKey) => {
      return getLayerCompFromKey(layerKey);
    });
  }, [mapLayers]);

  return (
    <Box width="100%" height="100%">
      <Map center={mapCenter}>{Layers}</Map>
    </Box>
  );
};

export default GisMap;
