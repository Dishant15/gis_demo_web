import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import { get } from "lodash";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import noop from "lodash/noop";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import SplicingContainer from "./SplicingContainer";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import {
  resetSelectedPorts,
  setSplicingElements,
} from "planning/data/splicing.reducer";
import { fetchElementPortSplicingDetails } from "planning/data/port.services";

const SplicingView = () => {
  const dispatch = useDispatch();
  const splicingPostData = useSelector(getPlanningMapStateData);

  const { mutate: getElementSplicingData, isLoading } = useMutation(
    fetchElementPortSplicingDetails,
    {
      onSuccess: (res) => {
        dispatch(setSplicingElements(res));
      },
    }
  );

  useEffect(() => {
    getElementSplicingData(splicingPostData);
    // clear port selection on window close
    return () => dispatch(resetSelectedPorts());
  }, []);

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  return (
    <GisMapPopups dragId="SplicingView">
      <Box minWidth="350px">
        <TableHeader
          title="Splicing View"
          minimized={false}
          handlePopupMinimize={noop}
          handleCloseDetails={handleCloseDetails}
        />
      </Box>
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <SplicingContainer />
      )}
    </GisMapPopups>
  );
};

export default SplicingView;
