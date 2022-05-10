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

// test imports

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path={getHomePath()} element={<HomePage />} />
          <Route path={getAreaPocketPath()} element={<AreaPocketPage />} />
          {/* testing routes */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
