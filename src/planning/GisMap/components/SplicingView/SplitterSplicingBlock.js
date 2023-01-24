import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import orderBy from "lodash/orderBy";
import max from "lodash/max";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import { PORT_STATUS_COLOR_MAPPING } from "../ElementPortDetails/port.utils";
import {
  connectionDotStyles,
  elementBorders,
  elementLabelCenter,
} from "./style.constants";
import { handleConnectionAdd } from "planning/data/splicing.actions";
import { getFirstSelectedPort } from "planning/data/splicing.selectors";

const SplitterSplicingBlock = ({
  portData,
  hasLeft = false,
  hasRight = false,
}) => {
  const dispatch = useDispatch();
  const { name, unique_id, layer_key, configuration, ports } = portData;
  const { input_ports, output_ports } = configuration;

  const selectedPort = useSelector(getFirstSelectedPort);

  const onAddConnectionClick = useCallback(
    (port) => () => {
      dispatch(handleConnectionAdd(port, layer_key));
    },
    [layer_key]
  );

  const portWrapperHeight = 40;
  const portHeight = 15;
  const maxPortCount = max([input_ports, output_ports]);
  const totalHeight = portWrapperHeight * maxPortCount;

  const InputPorts = [];
  const OutputPorts = [];
  const orderedPorts = orderBy(ports, ["sr_no"], ["asc"]);

  for (let pInd = 0; pInd < orderedPorts.length; pInd++) {
    const currPort = orderedPorts[pInd];
    const { id, sr_no, is_input, status, element } = currPort;
    // show conn dot if has left and curr port is input
    // else has right and curr port is output
    const showConnDot = (hasLeft && is_input) || (hasRight && !is_input);

    const Port = (
      <Box
        key={id}
        alignItems="center"
        flexDirection={is_input ? "row-reverse" : "row"}
        sx={{
          display: "flex",
          height: portWrapperHeight,
        }}
      >
        <Box
          flex={1}
          sx={{
            background: PORT_STATUS_COLOR_MAPPING[status] || "silver",
            height: portHeight - 8,
            width: "25px",
          }}
        ></Box>
        {showConnDot && status !== "C" ? (
          <Box
            display="flex"
            sx={connectionDotStyles(is_input)}
            onClick={onAddConnectionClick(currPort)}
          >
            {selectedPort.id === id && selectedPort.element === element ? ( // check if this port is selected
              <RadioButtonCheckedIcon fontSize="small" />
            ) : (
              <CircleIcon fontSize="small" />
            )}
          </Box>
        ) : null}
        <Box flex={1} textAlign="center">
          {sr_no}
        </Box>
      </Box>
    );

    if (is_input) InputPorts.push(Port);
    else OutputPorts.push(Port);
  }

  return (
    <Box>
      <Typography textAlign="center" variant="h6">
        {name}
      </Typography>
      <Stack direction="row" sx={{ height: totalHeight }}>
        <Stack direction="column" justifyContent="center">
          {InputPorts}
        </Stack>
        <Stack
          direction="row"
          sx={{
            flex: 1,
            background: "yellow",
            position: "relative",
            width: "150px",
            border: elementBorders,
          }}
        >
          <Box sx={elementLabelCenter}>{unique_id}</Box>
        </Stack>
        <Stack direction="column" justifyContent="center">
          {OutputPorts}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SplitterSplicingBlock;
