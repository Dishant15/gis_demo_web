import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import { get, noop, size } from "lodash";
import { Box, Divider, Stack, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SyncIcon from "@mui/icons-material/Sync";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import DummyListLoader from "./DummyListLoader";

import {
  fetchLayerDataThunk,
  fetchLayerList,
} from "planning/data/actionBar.services";
import {
  getLayerNetworkState,
  getLayerViewData,
} from "planning/data/planningGis.selectors";
import {
  handleLayerSelect,
  removeLayerSelect,
  setActiveTab,
} from "planning/data/planningState.reducer";
import {
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from "planning/data/planningState.selectors";
import { addNotification } from "redux/reducers/notification.reducer";
import { setMapState } from "planning/data/planningGis.reducer";
import { PLANNING_EVENT } from "planning/GisMap/utils";

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
  const dispatch = useDispatch();
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
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);

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
    if (!size(regionIdList)) {
      // show error notification to select regions first
      dispatch(
        addNotification({
          type: "error",
          title: "Select Region first",
          text: "Please select region to narrow down your search of elements.",
        })
      );
      // change tab to regions
      dispatch(setActiveTab(0));
      return;
    }
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
  const dispatch = useDispatch();
  // get list of elements for current key
  const layerData = useSelector(getLayerViewData(layerKey));

  const handleElementClick = useCallback(
    (elementId) => () => {
      dispatch(
        setMapState({
          event: PLANNING_EVENT.showElementDetails,
          layerKey,
          data: { elementId },
        })
      );
    },
    [layerKey]
  );

  return (
    <>
      {layerData.map((element) => {
        const { id, name } = element;
        return (
          <Box key={id} className="reg-list-pill-child">
            <Stack
              onClick={handleElementClick(id)}
              direction="row"
              flex={1}
              p={1}
              pl={3}
              sx={{
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography color="secondary.dark" variant="span">
                {name}
              </Typography>
              <FormatListBulletedIcon />
            </Stack>

            <Divider flexItem />
          </Box>
        );
      })}
    </>
  );
};

export default LayersTabContent;
