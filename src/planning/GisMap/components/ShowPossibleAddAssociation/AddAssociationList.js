import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import filter from "lodash/filter";
import get from "lodash/get";
import size from "lodash/size";
import includes from "lodash/includes";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

import IconButton from "@mui/material/IconButton";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

import ElementConfigPopup from "planning/ActionBar/components/ElementConfigPopup";
import AddElementContentLoader from "planning/ActionBar/components/AddElementContent/AddElementContentLoader";

import { fetchLayerListDetails } from "planning/data/actionBar.services";
import {
  selectConfiguration,
  setLayerConfigurations,
} from "planning/data/planningState.reducer";
import { getSelectedConfigurations } from "planning/data/planningState.selectors";
import {
  onAddElementGeometry,
  onAddElementDetails,
} from "planning/data/planning.actions";
import { LayerKeyMappings } from "../../utils";
import useValidateGeometry from "../../hooks/useValidateGeometry";
import { Button, Stack } from "@mui/material";
import { associateElementOnMapClick } from "planning/data/event.actions";

const getElementIdName = (layerKey) => {
  return `association-add-element-${layerKey}`;
};

const AddAssociationList = ({ listOfLayers, parentData, parentLayerKey }) => {
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
  const { validateElementMutation, isValidationLoading } =
    useValidateGeometry();
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

  const handleAddElementClick = useCallback(
    (layerKey) => () => {
      const childFeatureType = LayerKeyMappings[layerKey]["featureType"];
      const parentFeatureType = LayerKeyMappings[parentLayerKey]["featureType"];

      // when adding child region featureType will be same but need to draw new child region so go to else branch
      if (childFeatureType === parentFeatureType && layerKey !== "region") {
        // if both layer has same geometry copy geometry of parent to child and go to form directly
        const extraParent = {
          [parentLayerKey]: [{ ...parentData }],
        };
        // call validate geometry to get relations for new element
        validateElementMutation(
          {
            layerKey,
            featureType: childFeatureType,
            geometry: parentData.coordinates,
          },
          {
            onSuccess: (res) => {
              dispatch(
                onAddElementDetails({
                  layerKey,
                  validationRes: res,
                  submitData: { geometry: parentData.coordinates },
                  extraParent,
                })
              );
            },
          }
        );
      } else {
        // else go to map with extra contains by id check
        dispatch(
          onAddElementGeometry({
            layerKey,
            // check if new geometry will be inside parent
            restriction_ids: {
              [parentLayerKey]: parentData.id,
            },
          })
        );
      }
    },
    [parentLayerKey, parentData]
  );

  const handleAssociateExistingElementClick = useCallback(() => {
    // fire event to
    dispatch(
      associateElementOnMapClick({
        layerKey: parentLayerKey,
        elementData: parentData,
        listOfLayers,
      })
    );
  }, [parentLayerKey, parentData, listOfLayers]);

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

  if (isLoading || isValidationLoading) {
    return <AddElementContentLoader />;
  }

  if (!!size(layerCofigs)) {
    return (
      <Box p={2} pt={0}>
        <Stack direction="row" py={1} alignItems="center">
          <Typography
            variant="subtitle1"
            textTransform="uppercase"
            color="text.secondary"
            fontWeight={500}
          >
            Add Element
          </Typography>
          <Button onClick={handleAssociateExistingElementClick}>
            Associate Existing Element
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {layerCofigs.map((config) => {
            const { layer_key, name, is_configurable, configuration } = config;
            // get icon
            let Icon;
            if (is_configurable) {
              let currConfig = get(selectedConfigurations, layer_key, false);
              if (!currConfig) currConfig = get(configuration, "0", {});
              // configurable layers will have getIcon function
              Icon =
                LayerKeyMappings[layer_key]["getViewOptions"](currConfig).icon;
            } else {
              Icon = LayerKeyMappings[layer_key]["getViewOptions"]().icon;
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

export default AddAssociationList;
