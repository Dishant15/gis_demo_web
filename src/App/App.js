import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Box, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import NavigationBar from "../components/NavigationBar";
import HomePage from "../pages/HomePage";
import AreaPocketPage from "../pages/AreaPocketPage";
import Layout from "./Layout";
import LoginPage from "../pages/Authentication/LoginPage";

import {
  getAreaPocketPath,
  getHomePath,
  getLoginPath,
} from "../utils/url.constants";
import { theme } from "./theme";
import "./global.scss";

// test imports

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          <Box // set global background
            height="100%"
            width="100%"
            sx={{
              padding: "0px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <NavigationBar />
            <Routes>
              <Route path={getHomePath()} element={<Layout />}>
                <Route index path={getHomePath()} element={<HomePage />} />
                <Route
                  path={getAreaPocketPath()}
                  element={<AreaPocketPage />}
                />
              </Route>
              <Route path={getLoginPath()} element={<LoginPage />} />
              {/* testing routes */}
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
};

export default App;
