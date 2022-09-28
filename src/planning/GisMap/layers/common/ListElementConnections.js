import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { size } from "lodash";

import {
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import { ElemTableDummyLoader } from "planning/GisMap/components/ElementDetailsTable";

import { setMapState } from "planning/data/planningGis.reducer";
import { fetchElementConnections } from "planning/data/layer.services";
import { onElementAddConnectionEvent } from "planning/data/planning.actions";

const ListElementConnections = ({ layerKey, elementId, elementGeometry }) => {
  const dispatch = useDispatch();
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

        {!!size(elemConnectionData) ? (
          <Stack
            sx={{
              overflowY: "auto",
            }}
            divider={<Divider />}
          >
            {elemConnectionData.map((connection) => {
              const { element, layer_info } = connection;

              return (
                <Stack key={element.id}>
                  <Typography>
                    {layer_info.name} #{element.unique_id}
                  </Typography>
                  <Typography>
                    {element.name} ( {element.cable_end} End )
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Box>
            <Typography variant="h6">No Connections</Typography>
          </Box>
        )}
        <Box>
          <Button
            onClick={handleAddConnection}
            variant="outlined"
            color="success"
          >
            Add Connection
          </Button>
        </Box>
      </Box>
    </GisMapPopups>
  );
};

export default ListElementConnections;
