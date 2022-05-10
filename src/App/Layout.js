import React from "react";
import { Outlet, Link } from "react-router-dom";
import Container from "@mui/material/Container";

const Layout = () => {
  return (
    <Container
      maxWidth="100%"
      sx={{
        flex: 1,
      }}
    >
      <Outlet />
    </Container>
  );
};

export default Layout;
