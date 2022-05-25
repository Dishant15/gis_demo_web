import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { find, isNull } from "lodash";
import { Box, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "../../components/common/Loader";
import AreaPocketMap from "./AreaPocketMap";
import AddAreaForm from "./AddAreaForm";

import { fetchAreaPockets, getFillColor } from "./services";
import { coordsToLatLongMap, latLongMapToCoords } from "../../utils/map.utils";

import "./area-pocket-page.scss";

const AreaPocketPage = () => {
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
  const [newAreaParentId, setNewAreaParentId] = useState(null);

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

  const handleAreaCreate = useCallback((step, parent = null) => {
    setCreatePocket(step);
    setNewAreaParentId(parent);
    setShowSurveyDetails(null);
  }, []);

  const handleMapSubmit = useCallback((coords) => {
    setCreatePocket("D");
    setNewAreaCoords(latLongMapToCoords(coords));
  }, []);

  const onNewAreaCreate = useCallback(() => {
    setCreatePocket(null);
    setNewAreaCoords([]);
    setNewAreaParentId(null);
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
    <div id="geo-survey-page" className="page-wrapper">
      <div className="gsp-content-wrapper">
        <div className="gsp-pocket-list">
          <div className="gsp-list-wrapper">
            <div className="gsp-list-header-pill">List of Pockets</div>

            {data.map((survey) => {
              const { id, name, g_layer } = survey;
              const color = getFillColor(g_layer);
              const isActive = selectedSurvey.has(id);

              return (
                <Box className={`gsp-list-pill`} key={id}>
                  <Stack direction="row" width="100%" spacing={2}>
                    <Stack
                      direction="row"
                      width="100%"
                      spacing={2}
                      onClick={() => handleSurveyClick(id)}
                    >
                      <Box
                        sx={{ minWidth: "15px", backgroundColor: color }}
                      ></Box>
                      <Box
                        flex={1}
                        sx={{
                          color: isActive ? "secondary.main" : "inherit",
                        }}
                      >
                        {name}
                      </Box>
                      <Box>
                        <IconButton aria-label="add-area-pocket" size="small">
                          <VisibilityIcon
                            color={isActive ? "secondary" : "inherit"}
                          />
                        </IconButton>
                      </Box>
                    </Stack>
                    <Box
                      onClick={() => {
                        if (isNull(createPocket)) {
                          handleAreaCreate("M", id);
                        }
                      }}
                    >
                      <IconButton aria-label="add-area-pocket" size="small">
                        <AddIcon color="success" />
                      </IconButton>
                    </Box>
                  </Stack>
                </Box>
              );
            })}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                if (isNull(createPocket)) {
                  handleAreaCreate("M");
                }
              }}
            >
              Create Primary Area
            </Button>
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
              onCancel={onNewAreaCreate}
            />
            {createPocket === "D" ? (
              <div className="gsp-map-details">
                <AddAreaForm
                  key="add"
                  data={{
                    coordinates: newAreaCoords,
                    parentId: newAreaParentId,
                  }}
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
    </div>
  );
};

export default AreaPocketPage;
