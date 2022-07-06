import React from "react";

import { Box, Typography, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

export default function HomePage() {
  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Draw a Polygon
          </Typography>
          <Typography variant="body2">
            Click on the map to place points of the polygon
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            sx={{ marginRight: "8px" }}
            variant="contained"
            disableElevation
            color="error"
            size="small"
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
