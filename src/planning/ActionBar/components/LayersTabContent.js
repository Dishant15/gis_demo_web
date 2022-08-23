import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";

import { get, noop } from "lodash";
import { Box, Divider, Stack } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import DummyListLoader from "./DummyListLoader";

import {
  fetchLayerDataThunk,
  fetchLayerList,
} from "planning/data/actionBar.services";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
  getLayerNetworkState,
  getLayerViewData,
} from "planning/data/planningGis.selectors";
import {
  handleLayerSelect,
  removeLayerSelect,
} from "planning/data/planningState.reducer";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";

const regionLayerConfig = {
  layer_key: "region",
  name: "Regions",
  can_edit: false,
  can_add: false,
};

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
    {
      staleTime: Infinity,
      select: (data) => {
        return [regionLayerConfig, ...data];
      },
    }
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
  const [isExpanded, setExpanded] = useState(false);
  const layerNetState = useSelector(getLayerNetworkState(layer_key));

  const isLoading = get(layerNetState, "isLoading", false);
  const isSelected = get(layerNetState, "isSelected", false);
  const isFetched = get(layerNetState, "isFetched", false);
  const count = get(layerNetState, "count", 0);

  const handleExpandToggle = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, [setExpanded]);

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
        <Box
          sx={{ opacity: isFetched ? 1 : 0.3 }}
          onClick={isFetched ? handleExpandToggle : noop}
        >
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
          <span>
            {name} {isFetched ? `(${count})` : ""}
          </span>
          {isLoading ? (
            <LoadingButton loading />
          ) : isSelected ? (
            <CheckBoxIcon color="secondary" />
          ) : null}
        </Stack>
      </Stack>

      <Divider flexItem />

      {isExpanded ? <ElementList layerKey={layer_key} /> : null}
    </Box>
  );
};

const ElementList = ({ layerKey }) => {
  // get list of elements for current key
  const { viewData = [] } = useSelector(getLayerViewData(layerKey));

  return (
    <>
      {viewData.map((element) => {
        const { id, name } = element;
        return (
          <Box key={id} className="reg-list-pill-child">
            <Stack direction="row" width="100%" spacing={2}>
              <Stack
                direction="row"
                flex={1}
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={noop}
              >
                <span>{name}</span>
                <MyLocationIcon />
              </Stack>
            </Stack>

            <Divider flexItem />
          </Box>
        );
      })}
    </>
  );
};

export default LayersTabContent;
