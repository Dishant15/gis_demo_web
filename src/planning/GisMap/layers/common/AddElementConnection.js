import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import some from "lodash/some";
import indexOf from "lodash/indexOf";
import size from "lodash/size";

import {
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { addElementConnection } from "planning/data/layer.services";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { addNotification } from "redux/reducers/notification.reducer";
import { DRAG_ICON_WIDTH } from "utils/constant";
import { LayerKeyMappings } from "planning/GisMap/utils";
import {
  onElementListItemClick,
  openElementDetails,
} from "planning/data/planning.actions";

const AddElementConnection = () => {
  const dispatch = useDispatch();
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const { elementId, layerKey, elementList, existingConnections } = useSelector(
    getPlanningMapStateData
  );

  // on new cable connect add success add cableId to this list to show connected without server fetch
  const [newConnection, setNewConnection] = useState([]);

  const { mutate: updateConnectionMutation, isLoading } = useMutation(
    addElementConnection,
    {
      onSuccess: (res) => {
        // refetch cable layer gis data
        dispatch(
          fetchLayerDataThunk({
            regionIdList: selectedRegionIds,
            layerKey: "p_cable",
          })
        );
        // success notification
        dispatch(
          addNotification({
            type: "success",
            title: "Connection updated",
            text: "Element to table connection was updated successfully",
          })
        );
        // mark current cable as connected
        setNewConnection((currNewConns) => [...currNewConns, res.id]);
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "Connection update failed",
          })
        );
        console.log(err);
      },
    }
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handleConnect = useCallback(
    (cableId, cable_end) => {
      // required data = cable id, cable end
      // element id, element layer key
      const data = {
        connection: {
          element_id: elementId,
          element_layer_key: layerKey,
          cable_end,
        },
      };
      updateConnectionMutation({ data, cableId });
    },
    [elementId, layerKey]
  );

  const handleRemove = useCallback(
    (cableId, cable_end) => {
      // required data = cable id, cable end
      // element id, element layer key
      const data = {
        connection: {
          cable_end,
          is_delete: true,
        },
      };
      updateConnectionMutation({ data, cableId });
    },
    [elementId, layerKey]
  );

  const handleShowDetails = useCallback(
    (element) => () => {
      dispatch(
        openElementDetails({
          layerKey: element.layerKey,
          elementId: element.id,
        })
      );
    },
    []
  );

  const handleShowOnMap = useCallback(
    (element) => () => {
      dispatch(onElementListItemClick(element));
    },
    []
  );

  // loop over possible connections, This will be p_cable elements only for element connections
  const ConnectionList = elementList.map((element) => {
    const { id, name, cable_end, network_id, layerKey } = element;
    // check if same layer_key, id data in existingConnections
    const isConnected =
      some(existingConnections, ["element.id", id]) ||
      // if user just connected one of the cable, get that from state
      indexOf(newConnection, id) !== -1;
    // if true than disable connect btn
    const Icon = LayerKeyMappings[layerKey]["getViewOptions"](element).icon;
    return (
      <Stack
        key={network_id}
        direction="row"
        spacing={1}
        alignItems="center"
        py={0.5}
        className="change-bg-on-hover"
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
          <img className="responsive-img" src={Icon} alt={layerKey} />
        </Paper>
        <Stack flex={1} flexDirection="row">
          <Box
            className="clickable"
            flex={1}
            onClick={handleShowDetails(element)}
          >
            <Typography variant="subtitle1" lineHeight={1.1}>
              {name}
            </Typography>
            <Typography variant="caption">#{network_id}</Typography>
          </Box>
          <Tooltip title="Show on map">
            <IconButton
              sx={{
                marginLeft: "8px",
              }}
              aria-label="show-location"
              onClick={handleShowOnMap(element)}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isConnected ? "Remove" : "Add Connection"}>
            <IconButton
              sx={{
                marginLeft: "8px",
                marginRight: "8px",
              }}
              aria-label={isConnected ? "Remove" : "Add Connection"}
              onClick={() => {
                if (isConnected) {
                  handleRemove(id, cable_end);
                } else {
                  handleConnect(id, cable_end);
                }
              }}
            >
              {isConnected ? (
                <DeleteOutlineOutlinedIcon />
              ) : (
                <AddBoxOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  });

  return (
    <GisMapPopups dragId="AddElementConnection">
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
            Add Connection
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {size(elementList) ? (
          <Stack spacing={1} divider={<Divider />} py={1}>
            {ConnectionList}
          </Stack>
        ) : (
          <Box p={2}>
            <Typography variant="h6" color="text.secondary">
              No near by elements for connect
            </Typography>
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
};

export default AddElementConnection;
