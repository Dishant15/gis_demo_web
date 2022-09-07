import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { filter, size } from "lodash";

import DummyListLoader from "./DummyListLoader";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { fetchLayerList } from "planning/data/actionBar.services";
import { ICONS } from "utils/icons";
import { setMapState } from "planning/data/planningGis.reducer";
import { MAP_STATE } from "planning/GisMap/utils";
import { getPlanningMapState } from "planning/data/planningGis.selectors";

/**
 * Parent:
 *    ActionBar
 * Render list of elements user can add on map
 */
const AddElementContent = () => {
  const { isLoading, data } = useQuery("planningLayerConfigs", fetchLayerList, {
    staleTime: Infinity,
  });

  const dispatch = useDispatch();
  const { event } = useSelector(getPlanningMapState);

  const layerCofigs = useMemo(() => {
    return filter(data, ["can_add", true]);
  }, [data]);

  const handleAddElementClick = useCallback(
    (layerKey) => () => {
      if (!event) {
        dispatch(
          setMapState({
            event: MAP_STATE.addElement,
            layerKey,
          })
        );
      }
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
          const { layer_key, name } = config;

          return (
            <Grid item xs={4} key={layer_key} alignSelf="stretch">
              <div
                onClick={handleAddElementClick(layer_key)}
                className="pl-add-element-item"
              >
                <img src={ICONS(layer_key)} alt="" />
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
