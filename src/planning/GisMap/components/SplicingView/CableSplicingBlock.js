import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { find, orderBy, range } from "lodash";

import { FIBER_COLOR_CODE_HEX_MAPPING } from "../ElementPortDetails/port.utils";

const CableSplicingBlock = ({ portData, side }) => {
  const { configuration, ports } = portData;

  const { core_per_tube, ribbon_count, no_of_tube } = configuration;

  const fiberWrapperHeight = 50;
  const fiberHeight = 25;
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
            <Stack direction={side === "left" ? "row" : "row-reverse"} flex={1}>
              <Stack
                flex={1}
                sx={{ background: color, height: tubeHeight }}
                key={tInd}
              >
                T{tube_no}
              </Stack>
              {!!ribbon_count ? (
                <Stack direction="column" flex={1}>
                  {range(ribbon_count).map((r) => {
                    return (
                      <Box
                        sx={{
                          height: ribbonHeight,
                          width: "100%",
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
      const currPort = ports[fInd];
      const { id, fiber_color } = currPort;
      const isDash = fiber_color.includes("d-");
      const currFibColor = isDash ? fiber_color.substring(2) : fiber_color;

      const Fiber = (
        <Box
          key={id}
          alignItems="center"
          sx={{
            display: "flex",
            width: "100%",
            height: fiberWrapperHeight,
          }}
        >
          <Box
            flex={1}
            sx={{
              backgroundColor: FIBER_COLOR_CODE_HEX_MAPPING[currFibColor],
              width: "100%",
              height: fiberHeight,
            }}
          >
            {currPort.name}
          </Box>
        </Box>
      );
      if (currPort.is_input) IpFiber.push(Fiber);
      else OpFiber.push(Fiber);
    }

    return [IpFiber, OpFiber];
  }, [ports]);

  return (
    <Stack direction="row" sx={{ height: totalHeight }}>
      <Stack direction="column-reverse" sx={{ width: "50px" }}>
        {InputFibers}
      </Stack>
      <Stack direction="row" sx={{ width: "100px" }}>
        {TubeContainer}
      </Stack>
      <Stack direction="column" sx={{ width: "50px" }}>
        {OutputFibers}
      </Stack>
    </Stack>
  );
};

export default CableSplicingBlock;
