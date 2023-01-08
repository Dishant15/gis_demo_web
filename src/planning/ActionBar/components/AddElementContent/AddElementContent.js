import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";

import filter from "lodash/filter";
import get from "lodash/get";
import size from "lodash/size";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";

import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import PublishIcon from "@mui/icons-material/Publish";

import ElementConfigPopup from "../ElementConfigPopup";
import AddElementContentLoader from "./AddElementContentLoader";
import UploadForm from "./UploadForm";

import { LayerKeyMappings } from "planning/GisMap/utils";
import { fetchLayerListDetails } from "planning/data/actionBar.services";
import { getSelectedConfigurations } from "planning/data/planningState.selectors";
import {
  onAddElementGeometry,
  onFetchLayerListDetailsSuccess,
} from "planning/data/planning.actions";
import {
  getIsSuperAdminUser,
  getUserPermissions,
} from "redux/selectors/auth.selectors";

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
        dispatch(onFetchLayerListDetailsSuccess(layerConfData));
      },
    }
  );

  const dispatch = useDispatch();
  const [showFilePicker, setShowFilePicker] = useState(false);
  // if popup open : layerKey of selected configs, null if closed
  const [layerConfigPopup, setLayerConfigPopup] = useState(null);
  const selectedConfigurations = useSelector(getSelectedConfigurations);
  const isSuperUser = useSelector(getIsSuperAdminUser);
  const permissions = useSelector(getUserPermissions);

  // shape: [ { layer_key, name, is_configurable, can_add, can_edit,
  //              configuration: [ **list of layer wise configs] }, ... ]
  const layerCofigs = useMemo(() => {
    return filter(data, ["can_add", true]);
  }, [data]);

  const importLayerCofigs = useMemo(() => {
    return filter(
      data,
      (config) =>
        config.can_import &&
        (isSuperUser || get(permissions, `${config.layer_key}_upload`))
    );
  }, [data, permissions, isSuperUser]);

  const handleAddElementClick = useCallback(
    (layerKey) => () => {
      dispatch(onAddElementGeometry({ layerKey }));
    },
    []
  );

  const handleLayerConfigPopupShow = useCallback(
    (layerKey) => (e) => {
      if (e) e.stopPropagation();
      // show popover for selected layer
      setLayerConfigPopup(layerKey);
    },
    []
  );

  const handleFilePickerCancel = useCallback(() => {
    setShowFilePicker(false);
  }, []);

  const handleFilePickerShow = useCallback(() => {
    setShowFilePicker(true);
  }, []);

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

  const maybeRenderHeader = useMemo(() => {
    return (
      <>
        <Stack p={2} direction="row" justifyContent="space-between">
          <Typography variant="h6" color="primary">
            Add Element
          </Typography>
          {!!importLayerCofigs.length ? (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<PublishIcon />}
              onClick={handleFilePickerShow}
            >
              Upload
            </Button>
          ) : null}
        </Stack>
      </>
    );
  }, [importLayerCofigs]);

  if (isLoading) {
    return <AddElementContentLoader />;
  }

  return (
    <Box>
      {maybeRenderHeader}
      {!!size(layerCofigs) ? (
        <Grid container spacing={2}>
          {layerCofigs.map((config) => {
            const { layer_key, name, is_configurable, configuration } = config;
            // get icon
            let Icon;
            const getViewOptions = get(LayerKeyMappings, [
              layer_key,
              "getViewOptions",
            ]);
            if (is_configurable) {
              let currConfig = get(selectedConfigurations, layer_key, false);
              if (!currConfig) currConfig = get(configuration, "0", {});
              // configurable layers will have getIcon function
              Icon = getViewOptions ? getViewOptions(currConfig).icon : "";
            } else {
              Icon = getViewOptions ? getViewOptions().icon : "";
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
      ) : (
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
      )}
      <Dialog
        onClose={handleFilePickerCancel}
        open={showFilePicker}
        scroll="paper" // used to scroll content into dialog
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        {showFilePicker ? (
          <UploadForm
            onClose={handleFilePickerCancel}
            importLayerCofigs={importLayerCofigs}
          />
        ) : null}
      </Dialog>
    </Box>
  );
};

export default AddElementContent;
