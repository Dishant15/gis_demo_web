import { Box, Skeleton } from "@mui/material";
import React from "react";

const TaskLoading = () => {
  return (
    <Box>
      <Skeleton height={"300px"} width={"100%"} />
    </Box>
  );
};

export default TaskLoading;
