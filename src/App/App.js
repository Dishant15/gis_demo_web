import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import NavigationBar from "../components/NavigationBar";
import HomePage from "../pages/HomePage";
import GeoSurveyPage from "../pages/GeoSurveyPage/GeoSurveyPage";

import { getGeoSurveyPath, getHomePath } from "../utils/url.constants";
import "./global.scss";

// test imports
import SurveyPage from "../pages/Survey";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path={getHomePath()} element={<HomePage />} />
          <Route path={getGeoSurveyPath()} element={<GeoSurveyPage />} />
          {/* testing routes */}
          <Route path={"/survey"} element={<SurveyPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
