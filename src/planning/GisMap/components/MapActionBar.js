import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import size from "lodash/size";
import isNumber from "lodash/isNumber";

import { Box, Tooltip } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";

import {
  getMapHighlighted,
  getTicketMapHighlighted,
} from "planning/data/planningGis.selectors";
import {
  resetMapHighlight,
  resetTicketMapHighlight,
} from "planning/data/planningGis.reducer";

import "planning/styles/map-actionbar.scss";

const MapActionBar = () => {
  const dispatch = useDispatch();
  const mapHighlight = useSelector(getMapHighlighted);
  const ticketMapHighlight = useSelector(getTicketMapHighlighted);

  const handleResetHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(resetMapHighlight());
  }, []);

  const handleResetTicketHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(resetTicketMapHighlight());
  }, []);

  return (
    <Box position="absolute" top={60} left={10} className="map-actionbar">
      {!!size(mapHighlight) ? (
        <Tooltip title="Stop Highlight">
          <Box className="icon-button" onClick={handleResetHighlight}>
            <StopCircleIcon />
          </Box>
        </Tooltip>
      ) : null}
      {isNumber(ticketMapHighlight) ? (
        <Tooltip title="Stop Highlight">
          <Box className="icon-button" onClick={handleResetTicketHighlight}>
            <StopCircleIcon />
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default memo(MapActionBar);
