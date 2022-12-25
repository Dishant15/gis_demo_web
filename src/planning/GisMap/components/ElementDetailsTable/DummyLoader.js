import React from "react";
import { Skeleton, Box } from "@mui/material";

import range from "lodash/range";

import GisMapPopups from "../GisMapPopups";

const DummyLoader = () => {
  const rowPills = range(6);
  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        {rowPills.map((ind) => {
          return <Skeleton key={ind} animation="wave" height="30px" />;
        })}
      </Box>
    </GisMapPopups>
  );
};

export default DummyLoader;
