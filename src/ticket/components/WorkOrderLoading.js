import React from "react";
import { Box, Stack, Typography, Skeleton } from "@mui/material";

const WorkOrderLoading = () => {
  return (
    <Box id="dash-task-list" sx={{ backgroundColor: "#efefef" }}>
      <Typography className="dtl-title" variant="h5">
        Survey Tasks
      </Typography>
      <Stack
        className="dtl-content-wrapper"
        spacing={2}
        direction="row"
        height="100%"
        width="100%"
      >
        <Box sx={{ flex: 2 }}>
          <Skeleton height={"100%"} width={"100%"} />
        </Box>
        <Box sx={{ flex: 4 }}>
          <Skeleton height={"100%"} width={"100%"} />
        </Box>
      </Stack>
    </Box>
  );
};

export default WorkOrderLoading;
