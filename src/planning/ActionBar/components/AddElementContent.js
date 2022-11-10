import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { filter, get, size } from "lodash";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

import DummyListLoader from "./DummyListLoader";
import ElementConfigPopup from "./ElementConfigPopup";

import { LayerKeyMappings, PLANNING_EVENT } from "planning/GisMap/utils";
import { fetchLayerListDetails } from "planning/data/actionBar.services";
import { setMapState } from "planning/data/planningGis.reducer";
import { addNotification } from "redux/reducers/notification.reducer";
import {
  selectConfiguration,
  setLayerConfigurations,
} from "planning/data/planningState.reducer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import { getSelectedConfigurations } from "planning/data/planningState.selectors";

const getElementIdName = (layerKey) => {
  return `pl-add-element-${layerKey}`;
};
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
  const { event } = useSelector(getPlanningMapState);
  const selectedConfigurations = useSelector(getSelectedConfigurations);

  // shape: [ { layer_key, name, is_configurable, can_add, can_edit,
  //              configuration: [ **list of layer wise configs] }, ... ]
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
          event: PLANNING_EVENT.addElementGeometry,
          layerKey,
        })
      );
    },
    [event]
  );

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
          <ElementConfigPopup
            onClose={handleLayerConfigPopupHide}
            layerKey={layerConfigPopup}
          />
        ) : null}
      </Popover>
    );
  }, [layerConfigPopup]);

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
            let currConfig = get(selectedConfigurations, layer_key, false);
            if (!currConfig) currConfig = configuration[0];
            // configurable layers will have getIcon function
            Icon = LayerKeyMappings[layer_key]["Icon"](currConfig);
          } else {
            Icon = LayerKeyMappings[layer_key]["Icon"];
          }

          return (
            <Grid item xs={4} key={layer_key} alignSelf="stretch">
              <Box
                onClick={handleAddElementClick(layer_key)}
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
