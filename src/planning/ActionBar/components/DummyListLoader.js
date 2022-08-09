import React from "react";
import { Box, Stack, Skeleton } from "@mui/material";
import { range } from "lodash";

const DummyListLoader = () => {
  const regionPills = range(10);

  return (
    <Box id="region-page" className="page-wrapper">
      {regionPills.map((ind) => {
        return (
          <Stack spacing={0} key={ind}>
            <Skeleton animation="wave" height="50px" />
          </Stack>
        );
      })}
    </Box>
  );
};

export default DummyListLoader;
