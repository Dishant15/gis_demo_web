import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import some from "lodash/some";
import indexOf from "lodash/indexOf";

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

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { addElementConnection } from "planning/data/layer.services";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { addNotification } from "redux/reducers/notification.reducer";

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

  // loop over possible connections, This will be p_cable elements only for element connections
  const ConnectionList = elementList.map((element) => {
    const { id, name, cable_end } = element;
    // check if same layer_key, id data in existingConnections
    const isConnected =
      some(existingConnections, ["element.id", id]) ||
      // if user just connected one of the cable, get that from state
      indexOf(newConnection, id) !== -1;
    // if true than disable connect btn

    return (
      <Stack direction="row" key={id} p={2} alignItems="center">
        <Typography color="primary.main" textAlign="left" flex={1}>
          {name} ( {cable_end} End )
        </Typography>
        {isConnected ? (
          <>
            <Button disabled>Connected</Button>
            <Button
              disabled={isLoading}
              onClick={() => handleRemove(id, cable_end)}
            >
              remove
            </Button>
          </>
        ) : (
          <Button
            disabled={isLoading}
            onClick={() => handleConnect(id, cable_end)}
          >
            Add Connection
          </Button>
        )}
      </Stack>
    );
  });

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
            Add Connection
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* Content */}
        <Stack
          sx={{
            overflowY: "auto",
          }}
          divider={<Divider />}
        >
          {ConnectionList}
        </Stack>
      </Box>
    </GisMapPopups>
  );
};

export default AddElementConnection;
