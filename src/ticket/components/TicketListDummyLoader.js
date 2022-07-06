import React from "react";
import { range } from "lodash";

import { Box, Skeleton } from "@mui/material";

const TicketListDummyLoader = () => {
  const gridItems = range(6);
  return (
    <Box p={2} className="ag-theme-alpine" height="100%" width="100%">
      {gridItems.map((ind) => {
        return <Skeleton key={ind} animation="wave" height="5rem" />;
      })}
    </Box>
  );
};

export default TicketListDummyLoader;
