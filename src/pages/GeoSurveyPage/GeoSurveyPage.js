import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";

import AreaPocketMap from "./AreaPocketMap";
import Loader from "../../components/common/Loader";

import { fetchAreaPockets } from "./services";

import "./geo-survey-page.scss";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery("areaPocketList", fetchAreaPockets);
  const [selectedSurvey, setSelectedSurvey] = useState(new Set([]));

  const handleSurveyClick = useCallback((surveyId) => {
    setSelectedSurvey((surveySet) => {
      let newSet = new Set(surveySet);
      if (newSet.has(surveyId)) newSet.delete(surveyId);
      else newSet.add(surveyId);
      return newSet;
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div id="geo-survey-page" className="page-wrapper">
      <div className="page-title">Geo graphic survey</div>

      <div className="gsp-content-wrapper">
        <div className="gsp-pocket-list">
          <div className="gsp-list-wrapper">
            <div className="gsp-list-header-pill">List of Pockets</div>

            {data.map((survey) => {
              const { id, name } = survey;
              const isActive = selectedSurvey.has(id);

              return (
                <div
                  className={`gsp-list-pill ${isActive ? "active" : ""}`}
                  key={id}
                  onClick={() => handleSurveyClick(id)}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="gsp-content">
          <div className="gsp-map-title">Survey map</div>
          <div className="gsp-map-container">
            <AreaPocketMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoSurveyPage;