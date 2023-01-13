import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import noop from "lodash/noop";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";

const SplicingView = () => {
  const dispatch = useDispatch();
  // shape: {
  //   layerKey: parent layer key - ie. spliter,
  //   elementId: parent element id - ie. spliter element id,
  //   leftElement,
  //   rightElement
  // }
  const mapStateData = useSelector(getPlanningMapStateData);
  console.log(
    "🚀 ~ file: SplicingView.js:18 ~ SplicingView ~ mapStateData",
    mapStateData
  );

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
      <Typography variant="h6">SplicingView</Typography>
    </GisMapPopups>
  );
};

export default SplicingView;
