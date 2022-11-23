import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import size from "lodash/size";

import { Box, Tooltip } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";

import { getMapHighlighted } from "planning/data/planningGis.selectors";
import { resetMapHighlight } from "planning/data/planningGis.reducer";

import "planning/styles/map-actionbar.scss";

const MapActionBar = () => {
  const dispatch = useDispatch();
  const mapHighlight = useSelector(getMapHighlighted);

  const handleResetHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(resetMapHighlight());
  }, []);

  if (!!size(mapHighlight)) {
    return (
      <Box position="absolute" top={60} left={10} className="map-actionbar">
        <Tooltip title="Stop Highlight">
          <Box className="icon-button" onClick={handleResetHighlight}>
            <StopCircleIcon />
          </Box>
        </Tooltip>
      </Box>
    );
  }
  return null;
};

export default memo(MapActionBar);
