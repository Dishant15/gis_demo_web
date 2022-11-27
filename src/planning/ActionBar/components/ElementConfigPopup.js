import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Typography, Stack, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { getSingleLayerConfigurationList } from "planning/data/planningState.selectors";
import { selectConfiguration } from "planning/data/planningState.reducer";

/**
 * Show list on configurations
 * handle user click -> update config on redux
 *
 * Parent
 *  AddElementContent
 */
const ElementConfigPopup = ({ layerKey, onClose }) => {
  const dispatch = useDispatch();
  const configList = useSelector(getSingleLayerConfigurationList(layerKey));

  const handleConfigChange = (config) => () => {
    dispatch(
      selectConfiguration({
        layerKey,
        configuration: { ...config },
      })
    );
    onClose();
  };

  return (
    <Box>
      <Stack divider={<Divider />}>
        {configList.map((config) => {
          const { id, config_name } = config;

          return (
            <Stack
              onClick={handleConfigChange(config)}
              key={id}
              direction="row"
              justifyContent="space-between"
              className="clickable change-bg-on-hover"
              p={1}
            >
              <Box flex={1}>{config_name}</Box>
              <IconButton size="small">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ElementConfigPopup;
