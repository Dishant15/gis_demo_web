import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { filter, get, size } from "lodash";

import DummyListLoader from "./DummyListLoader";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { fetchLayerListDetails } from "planning/data/actionBar.services";
import { setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings, MAP_STATE } from "planning/GisMap/utils";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { addNotification } from "redux/reducers/notification.reducer";

/**
 * Parent:
 *    ActionBar
 * Render list of elements user can add on map
 */
const AddElementContent = () => {
  const { isLoading, data } = useQuery(
    "planningLayerConfigsDetails",
    fetchLayerListDetails,
    {
      staleTime: Infinity,
    }
  );

  const dispatch = useDispatch();
  const { event } = useSelector(getPlanningMapState);

  // shape: { layer_key, name, is_configurable, can_add, can_edit, configuration: [ **list of layer wise configs] }
  const layerCofigs = useMemo(() => {
    return filter(data, ["can_add", true]);
  }, [data]);

  const handleAddElementClick = useCallback(
    (layerKey) => () => {
      // show error if one event already running
      if (event) {
        dispatch(
          addNotification({
            type: "warning",
            title: "Operation can not start",
            text: "Please complete current operation before starting new",
          })
        );
        return;
      }
      // start event if no other event running
      dispatch(
        setMapState({
          event: MAP_STATE.addElement,
          layerKey,
        })
      );
    },
    [event]
  );

  if (isLoading) {
    return <DummyListLoader />;
  }

  if (!!size(layerCofigs)) {
    return (
      <Grid container spacing={2} mt={1}>
        {layerCofigs.map((config) => {
          const { layer_key, name, is_configurable, configuration } = config;
          // get icon
          let Icon;
          if (is_configurable) {
            const currConfig = get(configuration, "0", {});
            // configurable layers will have getIcon function
            Icon = LayerKeyMappings[layer_key]["Icon"](currConfig);
          } else {
            Icon = LayerKeyMappings[layer_key]["Icon"];
          }

          return (
            <Grid item xs={4} key={layer_key} alignSelf="stretch">
              <div
                onClick={handleAddElementClick(layer_key)}
                className="pl-add-element-item"
              >
                <img src={Icon} alt="" />
                <Typography variant="body2">{name}</Typography>
              </div>
            </Grid>
          );
        })}
      </Grid>
    );
  } else {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">
          There are no elements you can add to network !!
        </Typography>
      </Box>
    );
  }
};

export default AddElementContent;
