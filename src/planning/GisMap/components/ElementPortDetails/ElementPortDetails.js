import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import CablePortDetails from "./CablePortDetails";
import SpliterPortDetails from "./SpliterPortDetails";
import OltPortDetails from "./OltPortDetails";
import { GisElementTableLoader } from "planning/GisMap/components/GisMapPopups/GisMapPopupLoader";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { fetchElementPortDetails } from "planning/data/layer.services";
import { setMapState } from "planning/data/planningGis.reducer";

import { LAYER_KEY as CableLayerKey } from "planning/GisMap/layers/p_cable";
import { LAYER_KEY as OltLayerKey } from "planning/GisMap/layers/p_olt";
import { LAYER_KEY as SplitterLayerKey } from "planning/GisMap/layers/p_splitter";
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
      case CableLayerKey: {
        const transformedDetails = transformCablePortData(portDetails);
        return <CablePortDetails portDetails={transformedDetails} />;
      }
      case OltLayerKey: {
        return <OltPortDetails portDetails={portDetails} />;
      }
      case SplitterLayerKey: {
        return <SpliterPortDetails portDetails={portDetails} />;
      }

      default:
        return null;
    }
  }, [layerKey, portDetails]);

  if (isLoading) {
    return <GisElementTableLoader />;
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
        {minimized ? null : (
          <Box maxHeight="72vh" overflow="auto">
            {Content}
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default ElementPortDetails;
