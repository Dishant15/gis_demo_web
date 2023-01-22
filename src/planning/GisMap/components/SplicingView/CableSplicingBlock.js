import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import find from "lodash/find";
import orderBy from "lodash/orderBy";
import range from "lodash/range";

import {
  FIBER_COLOR_CODE_HEX_MAPPING,
  PORT_STATUS_COLOR_MAPPING,
} from "../ElementPortDetails/port.utils";

const CableSplicingBlock = ({ portData, side }) => {
  const { name, configuration, ports } = portData;

  const { core_per_tube, ribbon_count, no_of_tube } = configuration;

  const fiberWrapperHeight = 40;
  const fiberHeight = 15;
  const ribbonHeight = core_per_tube * fiberWrapperHeight;
  const hasRibbon = !!ribbon_count;
  const tubeHeight = hasRibbon
    ? ribbonHeight * ribbon_count
    : core_per_tube * fiberWrapperHeight;
  // calculate total height
  const totalHeight = tubeHeight * no_of_tube;

  // generate tube data to draw tubes
  const TubeContainer = useMemo(() => {
    // loop over no of tubes
    const tubes = [];
    for (let index = 0; index < no_of_tube; index++) {
      // get port to find tube color
      const matchPort = find(ports, { tube_no: index + 1 });
      tubes.push({
        tube_no: matchPort.tube_no,
        color: matchPort.tube_color,
      });
    }

    return (
      <Stack direction="column" flex={1}>
        {tubes.map((t, tInd) => {
          const { color, tube_no } = t;
          return (
            <Stack
              key={tInd}
              direction={side === "left" ? "row" : "row-reverse"}
              flex={1}
            >
              <Stack
                sx={{ background: color, height: tubeHeight, width: "80px" }}
              >
                T{tube_no}
              </Stack>
              {!!ribbon_count ? (
                <Stack direction="column">
                  {range(ribbon_count).map((r) => {
                    return (
                      <Box
                        sx={{
                          height: ribbonHeight,
                          width: "30px",
                          border: "1px solid black",
                        }}
                        key={r}
                      >
                        R{r + 1}
                      </Box>
                    );
                  })}
                </Stack>
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    );
  }, [no_of_tube, ribbon_count, side, ports]);

  const [InputFibers, OutputFibers] = useMemo(() => {
    const orderedPorts = orderBy(ports, ["sr_no"], ["asc"]);
    // create fiber list data
    let IpFiber = [];
    let OpFiber = [];

    for (let fInd = 0; fInd < orderedPorts.length; fInd++) {
      const currPort = orderedPorts[fInd];
      const { id, fiber_color, is_input, status } = currPort;
      const isDash = fiber_color.includes("d-");
      const currFibColor = isDash ? fiber_color.substring(2) : fiber_color;
      // if side is left show fiber color on output side
      // if side is right show fiber color on input side
      const showFiberColor =
        (side === "left" && !is_input) || (side === "right" && is_input);

      const Fiber = (
        <Box
          key={id}
          alignItems="center"
          flexDirection={side === "left" ? "row-reverse" : "row"}
          sx={{
            display: "flex",
            height: fiberWrapperHeight,
          }}
        >
          <Box
            flex={1}
            sx={{
              background: PORT_STATUS_COLOR_MAPPING[status],
              height: fiberHeight - 8,
              width: "25px",
            }}
          ></Box>
          {showFiberColor ? (
            <Box
              flex={1}
              sx={{
                background: FIBER_COLOR_CODE_HEX_MAPPING[currFibColor],
                height: fiberHeight,
                width: "25px",
                position: "relative",
              }}
            >
              {isDash ? (
                <Box
                  sx={{
                    border: "1px dashed black",
                    marginTop: "6px",
                  }}
                ></Box>
              ) : null}
            </Box>
          ) : null}
        </Box>
      );
      if (is_input) IpFiber.push(Fiber);
      else OpFiber.push(Fiber);
    }

    return [IpFiber, OpFiber];
  }, [ports, side]);

  return (
    <Box>
      <Typography textAlign="center" variant="h6">
        {name}
      </Typography>
      <Stack direction="row" sx={{ height: totalHeight }}>
        <Stack direction="column">{InputFibers}</Stack>
        <Stack direction="row">{TubeContainer}</Stack>
        <Stack direction="column">{OutputFibers}</Stack>
      </Stack>
    </Box>
  );
};

export default CableSplicingBlock;
