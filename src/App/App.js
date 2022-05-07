import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import HomePage from "../pages/HomePage";
import SurveyPage from "../pages/Survey";

import "./global.scss";

const App = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="survey" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
