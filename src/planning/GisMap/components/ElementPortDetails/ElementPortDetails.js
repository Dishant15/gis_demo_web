import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";

import GisMapPopupLoader from "../GisMapPopups/GisMapPopupLoader";
import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import CablePortDetails from "./CablePortDetails";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { fetchElementPortDetails } from "planning/data/layer.services";
import { setMapState } from "planning/data/planningGis.reducer";

import { LAYER_KEY as CableLayerKey } from "planning/GisMap/layers/p_cable";
import { transformCablePortData } from "./port.utils";

/**
 * fetch port details
 * manage loading
 * show port details
 *
 * Parent:
 *    GisMapEventLayer
 */
const ElementPortDetails = () => {
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(false);

  const { layerKey, data: mapStateData } = useSelector(getPlanningMapState);
  const { elementId } = mapStateData;

  const { data: portDetails, isLoading } = useQuery(
    ["elementPortDetails", layerKey, elementId],
    fetchElementPortDetails
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    setMinimized((val) => !val);
  }, []);

  const Content = useMemo(() => {
    switch (layerKey) {
      case CableLayerKey:
        const transformedDetails = transformCablePortData(portDetails);
        return <CablePortDetails portDetails={transformedDetails} />;

      default:
        return null;
    }
  }, [layerKey, portDetails]);

  if (isLoading) {
    return <GisMapPopupLoader />;
  }

  return (
    <GisMapPopups dragId="ShowAssociatedElements">
      <Box minWidth="350px" maxWidth="550px">
        <TableHeader
          title="Port details"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : Content}
      </Box>
    </GisMapPopups>
  );
};

export default ElementPortDetails;
