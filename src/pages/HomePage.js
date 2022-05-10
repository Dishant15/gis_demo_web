import React from "react";
import { Box, Typography } from "@mui/material";

import AddAreaForm from "./AreaPocketPage/AddAreaForm";

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h3">Home Page</Typography>
      <AddAreaForm />
    </Box>
  );
}
