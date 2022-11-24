import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import filter from "lodash/filter";
import get from "lodash/get";
import size from "lodash/size";
import includes from "lodash/includes";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

import IconButton from "@mui/material/IconButton";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CloseIcon from "@mui/icons-material/Close";

import GisMapPopups from "./GisMapPopups";
import DummyListLoader from "planning/ActionBar/components/DummyListLoader";

import { fetchLayerListDetails } from "planning/data/actionBar.services";
import {
  selectConfiguration,
  setLayerConfigurations,
} from "planning/data/planningState.reducer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { getSelectedConfigurations } from "planning/data/planningState.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { DRAG_ICON_WIDTH } from "utils/constant";
import { LayerKeyMappings } from "../utils";

const getElementIdName = (layerKey) => {
  return `pl-add-element-${layerKey}`;
};

const ShowPossibleAddAssociation = () => {
  const dispatch = useDispatch();

  const { layerKey, data } = useSelector(getPlanningMapState);
  const { elementId, elementName, listOfLayers } = data;
  console.log(
    "🚀 ~ file: ShowPossibleAddAssociation.js ~ line 17 ~ ShowPossibleAddAssociation ~ listOfLayers",
    listOfLayers
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  return (
    <GisMapPopups dragId="ShowPossibleAddAssociation">
      <Box minWidth="350px" maxWidth="550px">
        {/* header */}
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          alignItems="center"
          p={1}
          pl={`${DRAG_ICON_WIDTH}px`}
        >
          <Typography variant="h6" textAlign="left" flex={1}>
            {elementName}
          </Typography>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* content */}
        <AddContent listOfLayers={listOfLayers} />
      </Box>
    </GisMapPopups>
  );
};

const AddContent = ({ listOfLayers }) => {
  const { isLoading, data } = useQuery(
    "planningLayerConfigsDetails",
    fetchLayerListDetails,
    {
      staleTime: Infinity,
      onSuccess: (layerConfData) => {
        // res shape same as layerConfigs bellow
        if (!!size(layerConfData)) {
          for (let lc_ind = 0; lc_ind < layerConfData.length; lc_ind++) {
            const { layer_key, is_configurable, configuration } =
              layerConfData[lc_ind];
            if (is_configurable) {
              // if layerConfData is there set layer configs in redux
              dispatch(
                setLayerConfigurations({
                  layerKey: layer_key,
                  configurationList: configuration,
                })
              );
              // select default configs to show first
              dispatch(
                selectConfiguration({
                  layerKey: layer_key,
                  configuration: configuration[0],
                })
              );
            }
          }
        }
      },
    }
  );

  const dispatch = useDispatch();
  // if popup open : layerKey of selected configs, null if closed
  const [layerConfigPopup, setLayerConfigPopup] = useState(null);
  const selectedConfigurations = useSelector(getSelectedConfigurations);

  // shape: [ { layer_key, name, is_configurable, can_add, can_edit,
  //              configuration: [ **list of layer wise configs] }, ... ]
  const layerCofigs = useMemo(() => {
    return filter(data, (item) => {
      if (item.can_add && includes(listOfLayers, item.layer_key)) {
        return item;
      }
    });
  }, [data]);

  const handleLayerConfigPopupShow = useCallback(
    (layerKey) => (e) => {
      if (e) e.stopPropagation();
      // show popover for selected layer
      setLayerConfigPopup(layerKey);
    },
    []
  );

  const handleLayerConfigPopupHide = useCallback(() => {
    setLayerConfigPopup(null);
  }, []);

  const mayRenderElementConfigPopup = useMemo(() => {
    const showPopover = !!layerConfigPopup;
    // anchorEl required node element, so not saving full element in state
    // generate ids for layer keys and get element by simple javascript method
    return (
      <Popover
        open={showPopover}
        onClose={handleLayerConfigPopupHide}
        anchorEl={
          showPopover
            ? document.getElementById(getElementIdName(layerConfigPopup))
            : null
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transitionDuration={0}
      >
        {showPopover ? (
          // <ElementConfigPopup
          //   onClose={handleLayerConfigPopupHide}
          //   layerKey={layerConfigPopup}
          // />
          <Typography>ElementConfigPopup</Typography>
        ) : null}
      </Popover>
    );
  }, [layerConfigPopup]);

  if (isLoading) {
    return <DummyListLoader />;
  }

  if (!!size(layerCofigs)) {
    return (
      <Box p={2} pt={0}>
        <Typography
          variant="subtitle1"
          textTransform="uppercase"
          color="text.secondary"
          fontWeight={500}
          py={1}
        >
          Add Element
        </Typography>
        <Grid container spacing={2}>
          {layerCofigs.map((config) => {
            const { layer_key, name, is_configurable, configuration } = config;
            // get icon
            let Icon;
            if (is_configurable) {
              let currConfig = get(selectedConfigurations, layer_key, false);
              if (!currConfig) currConfig = configuration[0];
              // configurable layers will have getIcon function
              Icon =
                LayerKeyMappings[layer_key]["getViewOptions"](currConfig).icon;
            } else {
              Icon = LayerKeyMappings[layer_key]["getViewOptions"]().icon;
            }

            return (
              <Grid item xs={4} key={layer_key} alignSelf="stretch">
                <Box
                  // onClick={handleAddElementClick(layer_key)}
                  className="pl-add-element-item"
                  id={getElementIdName(layer_key)}
                >
                  <img src={Icon} alt="" />
                  <Typography variant="body2">{name}</Typography>

                  {is_configurable ? (
                    <Box
                      onClick={handleLayerConfigPopupShow(layer_key)}
                      className="pl-add-element-config-btn-wrapper"
                    >
                      <IconButton>
                        <SettingsApplicationsIcon />
                      </IconButton>
                    </Box>
                  ) : null}
                </Box>
              </Grid>
            );
          })}

          {mayRenderElementConfigPopup}
        </Grid>
      </Box>
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

export default ShowPossibleAddAssociation;
