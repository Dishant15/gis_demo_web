import React, { useMemo } from "react";
import { useQuery } from "react-query";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { filter } from "lodash";

import { fetchLayerList } from "planning/data/actionBar.services";
import { ICONS } from "utils/icons";

/**
 * Parent:
 *    ActionBar
 * Render list of elements user can add on map
 */
const AddElementContent = () => {
  const { isLoading, data } = useQuery("planningLayerConfigs", fetchLayerList, {
    staleTime: Infinity,
  });

  const layerCofigs = useMemo(() => {
    return filter(data, ["can_add", true]);
  }, [data]);

  if (layerCofigs.length) {
    return (
      <Grid container spacing={2} mt={1}>
        {layerCofigs.map((config) => {
          return (
            <Grid item xs={4} key={config.layer_key} alignSelf="stretch">
              <div className="pl-add-element-item">
                <img src={ICONS(config.layer_key)} alt="" />
                <Typography variant="body2">{config.name}</Typography>
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
        <Typography variant="h6">No elements created yet.</Typography>
      </Box>
    );
  }
};

export default AddElementContent;
