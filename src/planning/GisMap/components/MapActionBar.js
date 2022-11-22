import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import size from "lodash/size";

import { Box } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";

import { getMapHighlighted } from "planning/data/planningGis.selectors";
import { setMapHighlight } from "planning/data/planningGis.reducer";

import "planning/styles/map-actionbar.scss";

const MapActionBar = () => {
  const dispatch = useDispatch();
  const mapHighlight = useSelector(getMapHighlighted);

  const handleResetHighlight = useCallback((e) => {
    e.preventDefault();
    dispatch(setMapHighlight({}));
  }, []);

  if (!!size(mapHighlight)) {
    return (
      <Box position="absolute" top={60} left={10} className="map-actionbar">
        <div className="icon-button" onClick={handleResetHighlight}>
          <StopCircleIcon />
        </div>
      </Box>
    );
  }
  return null;
};

export default memo(MapActionBar);
