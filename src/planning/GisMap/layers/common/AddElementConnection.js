import React from "react";

import { Box } from "@mui/material";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";
import { useSelector } from "react-redux";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";

const AddElementConnection = () => {
  const data = useSelector(getPlanningMapStateData);
  console.log(
    "🚀 ~ file: AddElementConnection.js ~ line 11 ~ AddElementConnection ~ data",
    data
  );
  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px"></Box>
    </GisMapPopups>
  );
};

export default AddElementConnection;
