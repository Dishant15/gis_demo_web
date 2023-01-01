import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "planning/GisMap/components/GisMapPopups/GisMapPopups";
import AddAssociationList from "./AddAssociationList";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { DRAG_ICON_WIDTH } from "utils/constant";

const ShowPossibleAddAssociation = () => {
  const dispatch = useDispatch();

  const { layerKey, data } = useSelector(getPlanningMapState);
  const { elementData, listOfLayers } = data;

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  return (
    <GisMapPopups dragId="ShowPossibleAddAssociation">
      <Box minWidth="350px" maxWidth="550px">
        {/* header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          alignItems="center"
          p={1}
          pl={`${DRAG_ICON_WIDTH}px`}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            {elementData.name}
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <AddAssociationList
          parentData={elementData}
          parentLayerKey={layerKey}
          listOfLayers={listOfLayers}
        />
      </Box>
    </GisMapPopups>
  );
};

export default ShowPossibleAddAssociation;
