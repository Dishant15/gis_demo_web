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

  if (isLoading) {
    return <GisMapPopupLoader />;
  }

  const Content = useMemo(() => {
    switch (layerKey) {
      case "p_cable":
        // portDetails = [ { T6F4, cnn_to : spxysdf-P11.O, color: 'red', isInput: false}, { T6F4, cnn_to : sp.asdfb-P1.I, color: 'red', isInput: true}]

        // transformedPortDetails = [{ T6F4, color: 'red', conn__to_A_end= sp.asdfb-P1.I, conn__to_B_end: spxysdf-P11.O }]
        // portDetails -> F4T6 will have 2 port entry, input and output
        // transformedPortDetails -> combine input output
        // shape -> { srNo, name: T4F6, colors, conncted element : A, B }
        const transformedPortDetails = portDetails;
        return <CablePortDetails portDetails={transformedPortDetails} />;

      default:
        return null;
    }
  }, [layerKey, portDetails]);

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
