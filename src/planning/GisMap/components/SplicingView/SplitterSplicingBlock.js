import React from "react";

import orderBy from "lodash/orderBy";
import max from "lodash/max";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ConnectionToggleBtn from "./ConnectionToggleBtn";

import { PORT_STATUS_COLOR_MAPPING } from "../ElementPortDetails/port.utils";
import { elementBorders, elementLabelCenter } from "./style.constants";

const SplitterSplicingBlock = ({
  portData,
  hasLeft = false,
  hasRight = false,
}) => {
  const { name, unique_id, layer_key, configuration, ports } = portData;
  const { input_ports, output_ports } = configuration;

  const portWrapperHeight = 40;
  const portHeight = 15;
  const maxPortCount = max([input_ports, output_ports]);
  const totalHeight = portWrapperHeight * maxPortCount;

  const InputPorts = [];
  const OutputPorts = [];
  const orderedPorts = orderBy(ports, ["sr_no"], ["asc"]);

  for (let pInd = 0; pInd < orderedPorts.length; pInd++) {
    const currPort = orderedPorts[pInd];
    const { id, sr_no, is_input, status } = currPort;
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
        {showConnDot ? (
          <ConnectionToggleBtn portData={currPort} layer_key={layer_key} />
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
            borderRadius: "8px",
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
