import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import range from "lodash/range";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";

const GisMapPopupLoader = () => {
  const rowPills = range(6);

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        <Stack
          sx={{ backgroundColor: "primary.main", color: "background.default" }}
          direction="row"
          alignItems="center"
          p={1}
        >
          <Typography variant="h6" flex={1}>
            <Skeleton />
          </Typography>
        </Stack>
        {rowPills.map((ind) => {
          return (
            <Stack
              key={ind}
              direction="row"
              spacing={1}
              alignItems="center"
              p={0.5}
            >
              <Skeleton height="42px" width="42px" variant="rectangular" />
              <Box flex={1}>
                <Typography variant="subtitle1" lineHeight={1.1}>
                  <Skeleton />
                </Typography>
                <Typography variant="caption">
                  <Skeleton />
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Box>
    </GisMapPopups>
  );
};

export default GisMapPopupLoader;
