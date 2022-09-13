import React from "react";
import get from "lodash/get";

import { Divider, Stack, Typography, Skeleton, Chip, Box } from "@mui/material";

import GisMapPopups from "./GisMapPopups";
import { useQuery } from "react-query";
import { fetchElementDetails } from "planning/data/layer.services";
import { range } from "lodash";

/**
 * fetch element details
 * handle loading
 * show data in table form
 */
const ElementDetailsTable = ({ rowDefs, layerKey, elementId }) => {
  const { data: elemData, isLoading } = useQuery(
    ["elementDetails", layerKey, elementId],
    fetchElementDetails,
    { staleTime: Infinity }
  );

  // show dummy loader for loading
  if (isLoading) return <ElemTableDummyLoader />;
  return (
    <GisMapPopups>
      <Stack minWidth="350px" divider={<Divider />}>
        {rowDefs.map((row) => {
          const { label, field, type } = row;

          switch (type) {
            case "status":
              const elemStatus = get(elemData, field);
              const color =
                elemStatus === "V"
                  ? "success"
                  : elemStatus === "P"
                  ? "warning"
                  : "danger";

              return (
                <Stack direction="row" key={field} p={2}>
                  <Typography textAlign="left" width={"50%"}>
                    {label}
                  </Typography>
                  <Box textAlign="center" width={"50%"}>
                    <Chip
                      label={get(elemData, `${field}_display`)}
                      color={color}
                    />
                  </Box>
                </Stack>
              );

            default:
              return (
                <Stack direction="row" key={field} p={2}>
                  <Typography textAlign="left" width={"50%"}>
                    {label}
                  </Typography>
                  <Typography textAlign="center" width={"50%"}>
                    {get(elemData, field, "--") || "--"}
                  </Typography>
                </Stack>
              );
          }
        })}
      </Stack>
    </GisMapPopups>
  );
};

const ElemTableDummyLoader = () => {
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

export default ElementDetailsTable;
