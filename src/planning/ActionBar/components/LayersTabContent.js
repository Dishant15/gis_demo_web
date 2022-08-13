import React, { useCallback } from "react";
import { useQuery } from "react-query";

import { get, noop } from "lodash";
import { Box, Divider, Stack } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";

import DummyListLoader from "./DummyListLoader";

import {
  fetchLayerDataThunk,
  fetchLayerList,
} from "planning/data/actionBar.services";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { getLayerNetworkState } from "planning/data/planningGis.selectors";
import {
  handleLayerSelect,
  removeLayerSelect,
} from "planning/data/planningState.reducer";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";

const LayersTabContent = () => {
  /**
   * Render list of elements user can view on map
   * User can click and get data of layers
   * handle layer data loading
   *
   * Parent
   *  ActionBar
   */

  const { isLoading, data: layerCofigs = [] } = useQuery(
    "planningLayerConfigs",
    fetchLayerList,
    { staleTime: Infinity }
  );
  const regionIdList = useSelector(getSelectedRegionIds);

  if (isLoading) return <DummyListLoader />;

  return (
    <Stack>
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

const LayerTab = ({ layerConfig, regionIdList }) => {
  const { layer_key, name } = layerConfig;

  const dispatch = useDispatch();
  const layerNetState = useSelector(getLayerNetworkState(layer_key));

  const isExpanded = false;
  const isLoading = get(layerNetState, "isLoading", false);
  const isSelected = get(layerNetState, "isSelected", false);
  const isFetched = get(layerNetState, "isFetched", false);

  const onLayerClick = () => {
    if (isLoading) return;
    // add / remove current layer to selectedLayers
    if (isSelected) {
      dispatch(removeLayerSelect(layer_key));
    } else {
      dispatch(handleLayerSelect(layer_key));
      // if data for this layer not fetched fire api to get data
      if (!isFetched) {
        dispatch(fetchLayerDataThunk({ regionIdList, layerKey: layer_key }));
      }
    }
  };

  return (
    <Box className="reg-list-pill">
      <Stack direction="row" width="100%" spacing={2}>
        <Box onClick={noop}>
          <ExpandMore
            expand={isExpanded}
            aria-expanded={isExpanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
        <Stack
          direction="row"
          flex={1}
          sx={{
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={onLayerClick}
        >
          <span>{name}</span>
          {isLoading ? <LoadingButton loading /> : <CheckBoxIcon />}
        </Stack>
      </Stack>

      <Divider flexItem />
    </Box>
  );
};

export default LayersTabContent;
