import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";
import noop from "lodash/noop";
import size from "lodash/size";
import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "components/common/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SearchIcon from "@mui/icons-material/Search";

import DownloadLayer from "./DownloadLayer";

import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import {
  getLayerNetworkState,
  getLayerViewData,
} from "planning/data/planningGis.selectors";
import {
  handleLayerSelect,
  removeLayerSelect,
  setActiveTab,
} from "planning/data/planningState.reducer";
import { addNotification } from "redux/reducers/notification.reducer";
import {
  onLayerTabElementList,
  openElementDetails,
} from "planning/data/planning.actions";
import { LayerKeyMappings } from "planning/GisMap/utils";
import { checkUserPermission } from "redux/selectors/auth.selectors";

const LayerTab = ({ layerConfig, regionIdList }) => {
  /**
   * Render each tab of a layer key
   * Handle layer on click
   * Handle layer collapsible expand
   * Show list of elements on expand
   */
  const { layer_key, name } = layerConfig;

  const dispatch = useDispatch();
  const [isExpanded, setExpanded] = useState(false);
  const layerNetState = useSelector(getLayerNetworkState(layer_key));
  const hasDownloadPermission = useSelector(
    checkUserPermission(`${layer_key}_download`)
  );

  const isLoading = get(layerNetState, "isLoading", false);
  const isSelected = get(layerNetState, "isSelected", false);
  const isFetched = get(layerNetState, "isFetched", false);
  const count = get(layerNetState, "count", 0);

  // get icon
  const getViewOptions = get(LayerKeyMappings, [layer_key, "getViewOptions"]);
  const Icon = getViewOptions ? getViewOptions({}).icon : "";

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

  const handleSearchClick = useCallback(() => {
    dispatch(onLayerTabElementList(layer_key));
  }, [layer_key]);

  return (
    <Box className="reg-list-pill">
      <Stack direction="row" width="100%" spacing={2}>
        <Box
          sx={{ opacity: isFetched ? 1 : 0.3 }}
          onClick={isFetched ? handleExpandToggle : noop}
          display="flex"
        >
          <ExpandMore
            expand={isExpanded}
            aria-expanded={isExpanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
        <Box className="pl-layer-icon-block">
          <Box className="icon-wrapper">
            <img src={Icon} alt={name} />
          </Box>
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
          <Box display="flex" alignItems="center">
            {isLoading ? (
              <LoadingButton loading />
            ) : isSelected ? (
              <CheckBoxIcon color="secondary" />
            ) : null}
          </Box>
        </Stack>
      </Stack>

      <Divider flexItem />

      {isExpanded ? (
        <Box display="flex" justifyContent="space-between">
          {hasDownloadPermission ? (
            <DownloadLayer layerConfig={layerConfig} />
          ) : (
            <Box />
          )}
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={handleSearchClick}
          >
            Search
          </Button>
          {/* <ElementList layerKey={layer_key} /> */}
        </Box>
      ) : null}
    </Box>
  );
};

const ElementList = ({ layerKey }) => {
  const dispatch = useDispatch();
  // get list of elements for current key
  const layerData = useSelector(getLayerViewData(layerKey));

  const handleElementClick = useCallback(
    (elementId) => () => {
      dispatch(openElementDetails({ layerKey, elementId }));
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
              alignItems="center"
              flex={1}
              p={1}
              sx={{
                cursor: "pointer",
              }}
            >
              <Tooltip title="Show Details">
                <FormatListBulletedIcon
                  sx={{
                    color: "action.active",
                  }}
                />
              </Tooltip>
              <Typography
                className="text-underline"
                color="secondary.dark"
                variant="subtitle2"
                textAlign="right"
                flex={1}
                pr={3}
                fontWeight={400}
              >
                {name}
              </Typography>
            </Stack>

            <Divider flexItem />
          </Box>
        );
      })}
    </>
  );
};

export default LayerTab;
