import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { find, isNull } from "lodash";
import { Box, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "components/common/Loader";
import AreaPocketMap from "pages/AreaPocketPage/AreaPocketMap";
import AddAreaForm from "pages/AreaPocketPage/AddAreaForm";

import { fetchAreaPockets, getFillColor } from "pages/AreaPocketPage/services";
import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";

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
  // set of all selected area to show on map
  const [selectedArea, setSelectedArea] = useState(new Set([]));
  // show details on area list OR map polygon click
  const [showAreaDetails, setShowAreaDetails] = useState(null);
  // null : not creating, "M" : map, "E": edit, "D" : details
  const [createPocket, setCreatePocket] = useState(null);
  // set coordinates and parent Id of new Area that is being created
  const [newAreaCoords, setNewAreaCoords] = useState([]);
  const [newAreaParentId, setNewAreaParentId] = useState(null);

  const handleAreaDetails = useCallback(
    (surveyId) => {
      if (isNull(createPocket)) {
        setShowAreaDetails(surveyId);
      }
    },
    [setShowAreaDetails, createPocket]
  );

  const handleAreaClick = useCallback(
    (surveyId) => {
      setSelectedArea((surveySet) => {
        let newSet = new Set(surveySet);
        if (newSet.has(surveyId)) {
          newSet.delete(surveyId);
          // remove survey details
          if (surveyId === showAreaDetails) {
            handleAreaDetails(null);
          }
        } else {
          newSet.add(surveyId);
          handleAreaDetails(surveyId);
        }
        return newSet;
      });
    },
    [showAreaDetails]
  );

  const handleAreaCreate = useCallback((step, parent = null) => {
    setCreatePocket(step);
    setNewAreaParentId(parent);
    setShowAreaDetails(null);
  }, []);

  const handleMapSubmit = useCallback((coords) => {
    // move page state to Detail form
    setCreatePocket("D");
    // add coordinates to state
    setNewAreaCoords(latLongMapToCoords(coords));
  }, []);

  const resetAllSelection = useCallback(() => {
    setCreatePocket(null);
    setNewAreaCoords([]);
    setNewAreaParentId(null);
    setShowAreaDetails(null);
  }, []);

  const selectedAreaData = useMemo(() => {
    if (data) {
      return data.filter((d) => selectedArea.has(d.id));
    } else {
      return [];
    }
  }, [selectedArea, data]);

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
              const isActive = selectedArea.has(id);

              return (
                <Box className={`gsp-list-pill`} key={id}>
                  <Stack direction="row" width="100%" spacing={2}>
                    <Stack
                      direction="row"
                      width="100%"
                      spacing={2}
                      onClick={() => handleAreaClick(id)}
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
                  handleAreaCreate("M", null);
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
              surveyList={selectedAreaData}
              onAreaSelect={handleAreaDetails}
              editMode={createPocket === "M" ? "polygon" : null}
              editPocket={find(data, ["id", showAreaDetails])}
              onDrawComplete={() => setCreatePocket("E")}
              onSubmit={handleMapSubmit}
              onCancel={resetAllSelection}
            />
            {createPocket === "D" ? (
              <div className="gsp-map-details">
                <AddAreaForm
                  key="add"
                  data={{
                    coordinates: newAreaCoords,
                    parentId: newAreaParentId,
                  }}
                  onAreaCreate={resetAllSelection}
                />
              </div>
            ) : null}
            {isNull(showAreaDetails) ? null : (
              <div className="gsp-map-details">
                <AddAreaForm
                  key={showAreaDetails}
                  data={find(data, ["id", showAreaDetails])}
                  onAreaCreate={resetAllSelection}
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
