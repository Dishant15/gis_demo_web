import React from "react";
import { Typography } from "@mui/material";
import { useQuery } from "react-query";
import get from "lodash/get";

import { fetchActiveUserCount } from "gis_user/data/services";

const ActiveUserCount = () => {
  const { isLoading, data } = useQuery("activeUserCount", fetchActiveUserCount);

  return (
    <Typography variant="caption">
      ( Active Users : {isLoading ? "--" : get(data, "user_count", "--")} /{" "}
      {get(data, "max_count", "--")} )
    </Typography>
  );
};

export default ActiveUserCount;
