import React, { useMemo } from "react";

import orderBy from "lodash/orderBy";
import max from "lodash/max";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PORT_STATUS_COLOR_MAPPING } from "../ElementPortDetails/port.utils";

const SplitterSplicingBlock = ({ portData, side }) => {
  const { name, unique_id, configuration, ports } = portData;
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
    const { id, is_input, status } = currPort;

    const Port = (
      <Box
        key={id}
        alignItems="center"
        sx={{
          display: "flex",
          height: portWrapperHeight,
        }}
      >
        <Box
          flex={1}
          sx={{
            background: PORT_STATUS_COLOR_MAPPING[status],
            height: portHeight - 8,
            width: "25px",
          }}
        ></Box>
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
            width: "150px",
          }}
        >
          {unique_id}
        </Stack>
        <Stack direction="column" justifyContent="center">
          {OutputPorts}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SplitterSplicingBlock;
