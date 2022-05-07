import React from "react";
import { useQuery } from "react-query";

import { fetchAreaPockets } from "./services";

import "./geo-survey-page.scss";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery("areaPocketList", fetchAreaPockets);
  console.log(
    "🚀 ~ file: GeoSurveyPage.js ~ line 10 ~ const{isLoading,data}=useQuery ~ data",
    data
  );
  return (
    <div>
      <h1>This is geo survey page</h1>
    </div>
  );
};

export default GeoSurveyPage;
