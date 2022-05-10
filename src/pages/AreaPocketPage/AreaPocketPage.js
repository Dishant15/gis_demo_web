import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import AreaPocketMap from "./AreaPocketMap";
import Loader from "../../components/common/Loader";

import { fetchAreaPockets } from "./services";
import { coordsToLatLongMap } from "../../utils/map.utils";

import "./area-pocket-page.scss";
import { Box, Paper, Typography } from "@mui/material";
import { find, isNull } from "lodash";
import AddAreaForm from "./AddAreaForm";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery("areaPocketList", fetchAreaPockets, {
    select: (queryData) => {
      return queryData.map((d) => {
        // [ [lat, lng], ...]
        const { coordinates } = d;
        d.path = coordsToLatLongMap(coordinates);
        return d;
      });
    },
  });
  const [selectedSurvey, setSelectedSurvey] = useState(new Set([]));
  // show details on survey select and map polygon click
  const [showSurveyDetails, setShowSurveyDetails] = useState(null);
  // null : not creating, "M" : map, "E": edit, "D" : details
  const [createPocket, setCreatePocket] = useState(null);
  const [newAreaCoords, setNewAreaCoords] = useState([]);

  const handleSurveyDetails = useCallback(
    (surveyId) => {
      if (isNull(createPocket)) {
        setShowSurveyDetails(surveyId);
      }
    },
    [setShowSurveyDetails, createPocket]
  );

  const handleSurveyClick = useCallback(
    (surveyId) => {
      setSelectedSurvey((surveySet) => {
        let newSet = new Set(surveySet);
        if (newSet.has(surveyId)) {
          newSet.delete(surveyId);
          // remove survey details
          if (surveyId === showSurveyDetails) {
            handleSurveyDetails(null);
          }
        } else {
          newSet.add(surveyId);
          handleSurveyDetails(surveyId);
        }
        return newSet;
      });
    },
    [showSurveyDetails]
  );

  const handleAreaCreate = useCallback(
    (step) => {
      setCreatePocket(step);
      setShowSurveyDetails(null);
    },
    [setCreatePocket]
  );

  const handleMapSubmit = useCallback((coords) => {
    console.log(
      "🚀 ~ file: AreaPocketPage.js ~ line 68 ~ handleMapSubmit ~ coords",
      coords
    );
    setCreatePocket("D");
    setNewAreaCoords(coords);
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
    <Box
      id="geo-survey-page"
      className="page-wrapper"
      sx={{
        color: "primary.contrastText",
      }}
    >
      <div className="page-title">Geo graphic survey</div>

      <div className="gsp-content-wrapper">
        <div className="gsp-pocket-list">
          <div className="gsp-list-wrapper">
            <div className="gsp-list-header-pill">List of Pockets</div>

            <div
              onClick={() => {
                if (isNull(createPocket)) {
                  handleAreaCreate("M");
                }
              }}
            >
              Create New Pocket
            </div>
            {data.map((survey) => {
              const { id, name } = survey;
              const isActive = selectedSurvey.has(id);

              return (
                <Box
                  sx={{
                    color: isActive ? "secondary.main" : "inherit",
                  }}
                  className={`gsp-list-pill`}
                  key={id}
                  onClick={() => handleSurveyClick(id)}
                >
                  {name}
                </Box>
              );
            })}
          </div>
        </div>

        <div className="gsp-content">
          <div className="gsp-map-container">
            <AreaPocketMap
              surveyList={selectedSurveyData}
              onAreaSelect={handleSurveyDetails}
              editMode={createPocket === "M" ? "polygon" : null}
              onDrawComplete={() => setCreatePocket("E")}
              onSubmit={handleMapSubmit}
            />
            {createPocket === "M" ? (
              <div className="gsp-map-details">
                <Paper>
                  <Box>
                    <Typography variant="h4">Draw a Polygon</Typography>
                  </Box>
                </Paper>
              </div>
            ) : createPocket === "D" ? (
              <div className="gsp-map-details">
                <AddAreaForm />
              </div>
            ) : null}
            {isNull(showSurveyDetails) ? null : (
              <div className="gsp-map-details">
                <AreaDetailsComponent
                  data={find(data, ["id", showSurveyDetails])}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

const AreaDetailsComponent = ({ data }) => {
  const { name } = data;
  return (
    <Paper elevation={4}>
      <Box
        p={2}
        sx={{
          textAlign: "center",
          backgroundColor: "background.default",
        }}
      >
        <Typography variant="h5">{name}</Typography>
      </Box>
    </Paper>
  );
};

export default GeoSurveyPage;
