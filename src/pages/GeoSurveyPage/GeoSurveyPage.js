import React from "react";
import { useQuery } from "react-query";

import { fetchAreaPockets } from "./services";

import "./geo-survey-page.scss";
import Loader from "../../components/common/Loader";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery("areaPocketList", fetchAreaPockets);

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

              return (
                <div className="gsp-list-pill" key={id}>
                  {name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="gsp-content">
          <div className="gsp-map-title">Survey map</div>
        </div>
      </div>
    </div>
  );
};

export default GeoSurveyPage;
