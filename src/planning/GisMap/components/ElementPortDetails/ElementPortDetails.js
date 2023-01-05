import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";

import GisMapPopupLoader from "../GisMapPopups/GisMapPopupLoader";
import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";

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

  const { layerKey, data } = useSelector(getPlanningMapState);
  const { elementId } = data;

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

  return (
    <GisMapPopups dragId="ShowAssociatedElements">
      <Box minWidth="350px" maxWidth="550px">
        <TableHeader
          title="Port details"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : <PortDetails portDetails={portDetails} />}
      </Box>
    </GisMapPopups>
  );
};

const PortDetails = ({ portDetails }) => {
  console.log("🚀 ~ file: PortDetails ~ portDetails", portDetails);
  return <div>this is it</div>;
};

export default ElementPortDetails;
