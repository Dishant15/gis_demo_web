import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const SplicingContainerLoader = () => {
  return (
    <Box p={5}>
      <Stack spacing={15} direction="row" overflow="auto">
        <Skeleton height="500px" width="200px" sx={{ transform: "unset" }} />
        <Skeleton height="500px" width="200px" sx={{ transform: "unset" }} />
        <Skeleton height="500px" width="200px" sx={{ transform: "unset" }} />
      </Stack>
    </Box>
  );
};

export default SplicingContainerLoader;
