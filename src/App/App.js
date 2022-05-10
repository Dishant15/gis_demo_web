import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import NavigationBar from "../components/NavigationBar";
import HomePage from "../pages/HomePage";
import AreaPocketPage from "../pages/AreaPocketPage";

import {
  getAreaPocketPath,
  getGeoSurveyPath,
  getHomePath,
} from "../utils/url.constants";
import "./global.scss";
import { Box, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import Layout from "./Layout";

// test imports

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Box // set global background
            height="100%"
            width="100%"
            sx={{
              backgroundColor: "background.default",
              color: "primary.contrastText",
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
              {/* testing routes */}
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
