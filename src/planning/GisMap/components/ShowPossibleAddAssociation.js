import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Stack, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "./GisMapPopups";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";

const ShowPossibleAddAssociation = () => {
  const dispatch = useDispatch();

  const { layerKey, data } = useSelector(getPlanningMapState);
  const { elementId, elementName, listOfLayers } = data;
  console.log(
    "🚀 ~ file: ShowPossibleAddAssociation.js ~ line 17 ~ ShowPossibleAddAssociation ~ listOfLayers",
    listOfLayers
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  return (
    <GisMapPopups dragId="ShowPossibleAddAssociation">
      <Box>
        {/* header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            {elementName} - Add Associated
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export default ShowPossibleAddAssociation;
