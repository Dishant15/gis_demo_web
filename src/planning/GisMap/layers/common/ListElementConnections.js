import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import size from "lodash/size";

import {
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import AddIcon from "@mui/icons-material/Add";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import { default as ElemTableDummyLoader } from "planning/GisMap/components/ElementDetailsTable/DummyLoader";

import { setMapState } from "planning/data/planningGis.reducer";
import { fetchElementConnections } from "planning/data/layer.services";
import { onElementAddConnectionEvent } from "planning/data/planning.actions";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";

const ListElementConnections = ({ layerKey }) => {
  const dispatch = useDispatch();
  const { elementId, elementGeometry } = useSelector(getPlanningMapStateData);

  const { data: elemConnectionData, isLoading } = useQuery(
    ["elementConnections", layerKey, elementId],
    fetchElementConnections
  );

  const handleClose = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handleAddConnection = () => {
    dispatch(
      onElementAddConnectionEvent({
        layerKey,
        elementGeometry,
        elementId,
        existingConnections: elemConnectionData,
      })
    );
  };

  if (isLoading) return <ElemTableDummyLoader />;
  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {/* header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          p={1}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            Element Connections
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack
          sx={{ boxShadow: "0px 5px 7px -3px rgba(122,122,122,0.51)" }}
          p={2}
          direction="row"
          spacing={2}
        >
          <Button
            onClick={handleAddConnection}
            variant="outlined"
            color="success"
            startIcon={<AddIcon />}
          >
            Add Connection
          </Button>
        </Stack>

        {!!size(elemConnectionData) ? (
          <Stack
            sx={{
              overflowY: "auto",
            }}
            divider={<Divider />}
          >
            {elemConnectionData.map((connection) => {
              const { element, layer_info } = connection;
              const EndIcon =
                element.cable_end === "A" ? (
                  <LastPageIcon />
                ) : (
                  <FirstPageIcon />
                );

              return (
                <Stack p={1} key={element.id}>
                  <Box>
                    <Typography component="b">#{element.unique_id}</Typography>
                    <Typography color="#757575" component="i">
                      {" "}
                      Cable
                    </Typography>
                  </Box>
                  <Stack spacing={2} direction="row">
                    {EndIcon}
                    <Typography component="span">
                      {element.name} ( {element.cable_end} End )
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Box>
            <Typography variant="h6">No Connections</Typography>
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default ListElementConnections;
