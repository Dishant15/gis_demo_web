import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import PDPViewIcon from "assets/markers/p_dp_view.svg";
import SpliterIcon from "assets/markers/spliter_view.svg";

/**
 * Render list of elements user can add on map
 */
const AddElementContent = () => {
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
};

export default AddElementContent;
