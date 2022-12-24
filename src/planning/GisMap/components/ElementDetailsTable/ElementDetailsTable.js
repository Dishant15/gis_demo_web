import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import TableHeader from "./TableHeader";
import DummyLoader from "./DummyLoader";
import TableActions from "./TableActions";
import TableContent from "./TableContent";

import { fetchElementDetails } from "planning/data/layer.services";
import {
  setMapState,
  toggleMapPopupMinimize,
} from "planning/data/planningGis.reducer";

import { getPlanningMapState } from "planning/data/planningGis.selectors";

/**
 * fetch element details
 * handle loading
 * show data in table form
 *
 * renders:
 *    GisMapPopups
 *    TableHeader
 *    TableActions
 *    TableContent
 */
const ElementDetailsTable = ({ layerKey, onEditDataConverter }) => {
  const dispatch = useDispatch();
  const { minimized, data } = useSelector(getPlanningMapState);
  const { elementId } = data;

  const { data: elemData, isLoading } = useQuery(
    ["elementDetails", layerKey, elementId],
    fetchElementDetails
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    dispatch(toggleMapPopupMinimize());
  }, [dispatch]);

  // show dummy loader for loading
  if (isLoading) return <DummyLoader />;

  return (
    <GisMapPopups dragId="element-table">
      <Box minWidth="350px" maxWidth="550px">
        {/* Table header */}
        <TableHeader
          title="Element Details"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : (
          <>
            <TableActions
              elemData={elemData}
              layerKey={layerKey}
              onEditDataConverter={onEditDataConverter}
            />
            <TableContent layerKey={layerKey} elemData={elemData} />
          </>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default ElementDetailsTable;
