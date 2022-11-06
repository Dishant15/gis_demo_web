import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import { Divider, Stack, Typography, Button } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

import DummyListLoader from "../DummyListLoader";
import LayerTab from "./LayerTab";

import {
  fetchLayerDataThunk,
  fetchLayerList,
} from "planning/data/actionBar.services";
import {
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from "planning/data/planningState.selectors";

const LayersTabContent = () => {
  /**
   * Render list of elements user can view on map
   * User can click and get data of layers
   * handle layer data loading
   *
   * Parent
   *  ActionBar
   */
  const dispatch = useDispatch();

  const regionIdList = useSelector(getSelectedRegionIds);
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);

  const { isLoading, data: layerCofigs = [] } = useQuery(
    "planningLayerConfigs",
    fetchLayerList,
    {
      staleTime: Infinity,
    }
  );

  const handleFullDataRefresh = useCallback(() => {
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(fetchLayerDataThunk({ regionIdList, layerKey: currLayerKey }));
    }
  }, [regionIdList, selectedLayerKeys]);

  if (isLoading) return <DummyListLoader />;

  return (
    <Stack>
      <Stack p={2} direction="row" justifyContent="space-between">
        <Typography variant="h6" color="primary">
          Select Layers
        </Typography>
        <Button
          variant="outlined"
          color="success"
          size="small"
          startIcon={<SyncIcon />}
          onClick={handleFullDataRefresh}
        >
          Refresh
        </Button>
      </Stack>
      <Divider />
      {layerCofigs.map((layer) => {
        return (
          <LayerTab
            key={layer.layer_key}
            layerConfig={layer}
            regionIdList={regionIdList}
          />
        );
      })}
    </Stack>
  );
};

export default LayersTabContent;
