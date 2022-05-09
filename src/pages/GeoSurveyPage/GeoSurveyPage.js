import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import AreaPocketMap from "./AreaPocketMap";
import NewLibMap from "./NewLibMap";
import Loader from "../../components/common/Loader";

import { fetchAreaPockets } from "./services";

import "./geo-survey-page.scss";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery("areaPocketList", fetchAreaPockets, {
    select: (queryData) => {
      return queryData.map((d) => {
        // [ [lat, lng], ...]
        const { coordinates } = d;
        const path = [];
        for (let cInd = 0; cInd < coordinates.length; cInd++) {
          const coord = coordinates[cInd];
          path.push({
            lat: coord[0],
            lng: coord[1],
          });
        }
        d.path = path;
        return d;
      });
    },
  });
  const [selectedSurvey, setSelectedSurvey] = useState(new Set([]));

  const handleSurveyClick = useCallback((surveyId) => {
    setSelectedSurvey((surveySet) => {
      let newSet = new Set(surveySet);
      if (newSet.has(surveyId)) newSet.delete(surveyId);
      else newSet.add(surveyId);
      return newSet;
    });
  }, []);

  const selectedSurveyData = useMemo(() => {
    if (data) {
      return data.filter((d) => selectedSurvey.has(d.id));
    } else {
      return [];
    }
  }, [selectedSurvey, data]);

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
            <NewLibMap surveyList={selectedSurveyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoSurveyPage;
