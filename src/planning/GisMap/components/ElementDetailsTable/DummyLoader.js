import React from "react";
import { Skeleton, Stack } from "@mui/material";
import { range } from "lodash";
import GisMapPopups from "../GisMapPopups";

const DummyLoader = () => {
  const rowPills = range(6);
  return (
    <GisMapPopups>
      <Stack>
        {rowPills.map((ind) => {
          return <Skeleton key={ind} animation="wave" height="30px" />;
        })}
      </Stack>
    </GisMapPopups>
  );
};

export default DummyLoader;
