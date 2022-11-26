import React from "react";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import GisMapPopups from "./GisMapPopups";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";

const ElementList = () => {
  const { elementList } = useSelector(getPlanningMapStateData);
  console.log(
    "🚀 ~ file: ElementList.js ~ line 12 ~ ElementList ~ elementList",
    elementList
  );
  return (
    <GisMapPopups>
      <Box>
        <h1>This is SPARTAAAA......</h1>
      </Box>
    </GisMapPopups>
  );
};

export default ElementList;
