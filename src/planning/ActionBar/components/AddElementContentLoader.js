import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import range from "lodash/range";

const AddElementContentLoader = () => {
  const rowPills = range(6);

  return (
    <Grid container spacing={2} mt={1}>
      {rowPills.map((ind) => {
        return (
          <Grid item xs={4} key={ind} alignSelf="stretch">
            <Box className="pl-add-element-item">
              <Skeleton
                variant="rectangular"
                width={38}
                height={38}
                sx={{ margin: "0 auto" }}
              />
              <Typography variant="body2">
                <Skeleton />
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AddElementContentLoader;
