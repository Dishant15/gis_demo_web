import React from "react";
import { Typography, Container, Paper } from "@mui/material";

import Image from "assets/under_construction.svg";

const ComingSoon = ({ contentHeight = "auto" }) => {
  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      <Paper className="coming-soon">
        <div className="coming-soon-content">
          <img src={Image} />
          <Typography variant="h5">Coming Soon</Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default ComingSoon;
