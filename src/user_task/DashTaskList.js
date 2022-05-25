import React from "react";
import { useQuery } from "react-query";

import { Box, Typography } from "@mui/material";
import Loader from "../components/common/Loader";
import { fetchUserTasks } from "./data/task.services";

const DashTaskList = () => {
  const { isLoading, data: userTaskList } = useQuery(
    "userTaskList",
    fetchUserTasks
  );
  console.log(
    "🚀 ~ file: DashTaskList.js ~ line 7 ~ DashTaskList ~ userTaskList",
    userTaskList
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Box id="dash-task-list">
      <Typography variant="h3">This is Dashboard Task List</Typography>
    </Box>
  );
};

export default DashTaskList;
