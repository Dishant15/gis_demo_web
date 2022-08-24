import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PDPViewIcon from "assets/markers/p_dp_view.svg";
import SpliterIcon from "assets/markers/spliter_view.svg";

/**
 * Parent:
 *    ActionBar
 * Render list of elements user can add on map
 */
const AddElementContent = () => {
  const hasElements = true;
  if (hasElements) {
    return (
      <Grid container spacing={2} mt={1}>
        <Grid item xs={4}>
          <div className="pl-add-element-item">
            <img src={PDPViewIcon} alt="" />
            <Typography variant="body2">DP</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="pl-add-element-item">
            <img src={SpliterIcon} alt="" />
            <Typography variant="body2">Spliter</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="pl-add-element-item">
            <img src={PDPViewIcon} alt="" />
            <Typography variant="body2">DP</Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="pl-add-element-item">
            <img src={SpliterIcon} alt="" />
            <Typography variant="body2">Spliter</Typography>
          </div>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">No elements created yet.</Typography>
      </Box>
    );
  }
};

export default AddElementContent;
