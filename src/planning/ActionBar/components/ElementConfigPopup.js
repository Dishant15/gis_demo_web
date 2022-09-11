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
    <Box
      p={3}
      component="form"
      sx={{
        paddingTop: "10px",
      }}
    >
      <Stack direction="row" spacing={2} width="100%" alignItems="center">
        <Typography variant="h6" color="primary.main" flex={1}>
          Select Configuration
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider
        flexItem
        sx={{
          marginTop: "4px",
          marginBottom: "16px",
        }}
      />
      <Stack spacing={2}>
        {configList.map((config) => {
          const { id, config_name } = config;

          return (
            <Stack
              onClick={handleConfigChange(config)}
              key={id}
              direction="row"
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
