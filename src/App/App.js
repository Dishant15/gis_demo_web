import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SurveyPage from "../pages/Survey";

import "./global.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="survey" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
