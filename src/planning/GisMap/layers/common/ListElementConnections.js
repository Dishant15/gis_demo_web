import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import size from "lodash/size";
import get from "lodash/get";

import {
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import SwipeLeftAltIcon from "@mui/icons-material/SwipeLeftAlt";
import SwipeRightAltIcon from "@mui/icons-material/SwipeRightAlt";

import AddIcon from "@mui/icons-material/Add";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import GisMapPopupLoader from "planning/GisMap/components/GisMapPopups/GisMapPopupLoader";

import { setMapState } from "planning/data/planningGis.reducer";
import { fetchElementConnections } from "planning/data/layer.services";
import { onElementAddConnectionEvent } from "planning/data/planning.actions";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";
import { DRAG_ICON_WIDTH } from "utils/constant";

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
      })
    );
  };

  if (isLoading) return <GisMapPopupLoader />;
  return (
    <GisMapPopups dragId="ElementConnections">
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
            Element Connections
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack p={1} direction="row" spacing={2}>
          <Tooltip title="Add Connection">
            <IconButton
              sx={{
                border: "1px solid",
                borderRadius: 1,
              }}
              onClick={handleAddConnection}
              variant="outlined"
              color="secondary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider />
        {!!size(elemConnectionData) ? (
          <Stack
            spacing={1}
            py={1}
            divider={<Divider />}
            maxHeight="72vh"
            overflow="auto"
          >
            {elemConnectionData.map((connection) => {
              const { element, layer_info } = connection;
              const EndIcon =
                element.cable_end === "A" ? (
                  <SwipeRightAltIcon
                    fontSize="small"
                    sx={{
                      color: "text.secondary",
                    }}
                  />
                ) : (
                  <SwipeLeftAltIcon
                    fontSize="small"
                    sx={{
                      color: "text.secondary",
                    }}
                  />
                );
              const Icon = LayerKeyMappings[layer_info.layer_key][
                "getViewOptions"
              ]({}).icon;
              return (
                <Stack
                  key={element.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Paper
                    sx={{
                      width: "42px",
                      height: "42px",
                      lineHeight: "42px",
                      textAlign: "center",
                      marginLeft: "8px",
                    }}
                  >
                    <img
                      className="responsive-img"
                      src={Icon}
                      alt={layer_info.layer_key}
                    />
                  </Paper>
                  <Stack flex={1} flexDirection="row">
                    <Box flex={1}>
                      <Typography variant="subtitle1" lineHeight={1.1}>
                        {get(element, "name", "")}
                      </Typography>
                      <Typography variant="caption">
                        #{get(element, "network_id", "")}
                      </Typography>
                    </Box>
                    <Stack alignItems="center" pr={1} maxWidth="52px">
                      <Typography variant="caption">
                        {element.cable_end} End
                      </Typography>
                      {EndIcon}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Box p={2}>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              No Connections
            </Typography>
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default ListElementConnections;
