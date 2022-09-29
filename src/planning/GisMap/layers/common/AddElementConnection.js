import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import some from "lodash/some";

import {
  Divider,
  Stack,
  Typography,
  Skeleton,
  Chip,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { useMutation } from "react-query";
import { addElementConnection } from "planning/data/layer.services";
import { indexOf } from "lodash";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";

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
        // mark current cable as connected
        setNewConnection((currNewConns) => [...currNewConns, res.id]);
      },
      onError: (err) => console.log(err),
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
    [elementId, layerKey, isLoading]
  );

  // loop over possible connections, This will be p_cable elements only for element connections
  const ConnectionList = elementList.map((element) => {
    const { id, name, cable_end } = element;
    // check if same layer_key, id data in existingConnections
    const isConnected =
      some(existingConnections, ["element.id", id]) ||
      indexOf(newConnection, id) !== -1;
    // if true than disable connect btn

    return (
      <Stack direction="row" key={id} p={2} alignItems="center">
        <Typography color="primary.main" textAlign="left" flex={1}>
          {name} ( {cable_end} End )
        </Typography>
        {isConnected ? (
          <Button disabled>Connected</Button>
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
