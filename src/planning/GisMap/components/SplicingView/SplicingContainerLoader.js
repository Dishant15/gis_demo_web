import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const SplicingContainerLoader = () => {
  return (
    <Box p={3}>
      <Skeleton height="500px" width="100%" sx={{ transform: "unset" }} />
    </Box>
  );
};

export default SplicingContainerLoader;
