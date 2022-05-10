import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { find, isNull } from "lodash";
import { Box, Paper, Typography } from "@mui/material";
import Loader from "../../components/common/Loader";
import AreaPocketMap from "./AreaPocketMap";
import AddAreaForm from "./AddAreaForm";

import { fetchAreaPockets } from "./services";
import { coordsToLatLongMap, latLongMapToCoords } from "../../utils/map.utils";

import "./area-pocket-page.scss";

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

  const handleAreaCreate = useCallback((step) => {
    setCreatePocket(step);
    setShowSurveyDetails(null);
  }, []);

  const handleMapSubmit = useCallback((coords) => {
    setCreatePocket("D");
    setNewAreaCoords(latLongMapToCoords(coords));
  }, []);

  const onNewAreaCreate = useCallback((surveyId) => {
    setCreatePocket(null);
    setNewAreaCoords([]);
    setShowSurveyDetails(null);
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
    <Box id="geo-survey-page" className="page-wrapper">
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
                <AddAreaForm
                  key="add"
                  data={{ coordinates: newAreaCoords }}
                  onAreaCreate={onNewAreaCreate}
                />
              </div>
            ) : null}
            {isNull(showSurveyDetails) ? null : (
              <div className="gsp-map-details">
                <AddAreaForm
                  key={showSurveyDetails}
                  data={find(data, ["id", showSurveyDetails])}
                  onAreaCreate={onNewAreaCreate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default GeoSurveyPage;
