import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { find, isNull, pick } from "lodash";

import { Box, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Loader from "components/common/Loader";
import AreaPocketMap from "./AreaPocketMap";
import AddAreaForm from "./AddAreaForm";

import { fetchAreaPockets, getFillColor } from "pages/AreaPocketPage/services";
import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";
import Api from "utils/api.utils";
import { apiPutAreaPocketEdit } from "utils/url.constants";

import "./area-pocket-page.scss";

/**
 * Fetch area pocket list
 * render list of pocket sidebar
 * render AreaPocket Map
 * user can select multiple area to show on map
 * user can see area details on popup
 * user can edit selected area coordinates , update details in popup
 * user can add new area, add details in popup
 *
 * Parent
 *  App
 *
 * Renders
 *  AreaPocketMap
 *  AddAreaForm
 */
const AreaPocketPage = () => {
  const queryClient = useQueryClient();
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
  const { mutate, isLoading: editAreaLoading } = useMutation(
    (data) => {
      Api.put(apiPutAreaPocketEdit(data.id), data);
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("areaPocketList");
        }, 100);
      },
    }
  );
  // set of all selected area to show on map
  const [selectedArea, setSelectedArea] = useState(new Set([]));
  // show details on area list OR map polygon click
  const [showAreaDetails, setShowAreaDetails] = useState(null);
  // null : not creating, "M" : map, "E": edit, "D" : details
  const [createPocket, setCreatePocket] = useState(null);
  // set coordinates and parent Id of new Area that is being created
  const [newAreaCoords, setNewAreaCoords] = useState([]);
  const [newAreaParentId, setNewAreaParentId] = useState(null);
  // save edit state for area
  const [editAreaData, setEditAreaData] = useState(null);

  const handleAreaDetails = useCallback(
    (areaId) => {
      if (isNull(createPocket)) {
        setShowAreaDetails(areaId);
      }
    },
    [setShowAreaDetails, createPocket]
  );

  const handleAreaClick = useCallback(
    (areaId) => {
      setSelectedArea((surveySet) => {
        let newSet = new Set(surveySet);
        if (newSet.has(areaId)) {
          newSet.delete(areaId);
          // remove survey details
          if (areaId === showAreaDetails) {
            handleAreaDetails(null);
          }
        } else {
          newSet.add(areaId);
          handleAreaDetails(areaId);
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

  const startEditArea = useCallback(
    (areaData) => () => {
      setEditAreaData(areaData);
      setCreatePocket("E");
      // clear selected area popups if any
      setShowAreaDetails(null);
    },
    []
  );

  const handleAreaEdit = useCallback((areaData) => {
    // update data to be in form of server submit
    let submitData = pick(areaData, [
      "id",
      "name",
      "area",
      "city",
      "state",
      "pincode",
    ]);
    submitData.coordinates = latLongMapToCoords(areaData.path);
    submitData.parentId = areaData.parent;
    // update area data to server
    mutate(submitData);
    // reset edit area state
    setEditAreaData(null);
    setCreatePocket(null);
  }, []);

  const resetAllSelection = useCallback(() => {
    setCreatePocket(null);
    setNewAreaCoords([]);
    setNewAreaParentId(null);
    setShowAreaDetails(null);
    setEditAreaData(null);
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

            {data.map((area) => {
              const { id, name, g_layer } = area;
              const color = getFillColor(g_layer);
              const isActive = selectedArea.has(id);
              const isEdit = editAreaData?.id === id;

              return (
                <Box className={`gsp-list-pill`} key={id}>
                  <Stack direction="row" width="100%" spacing={2}>
                    <Stack direction="row" width="100%" spacing={2}>
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
                      <Box onClick={() => handleAreaClick(id)}>
                        <IconButton aria-label="add-area-pocket" size="small">
                          <VisibilityIcon
                            color={isActive ? "secondary" : "inherit"}
                          />
                        </IconButton>
                      </Box>
                      <Box onClick={startEditArea(area)}>
                        <IconButton aria-label="add-area-pocket" size="small">
                          <EditIcon color={isEdit ? "secondary" : "inherit"} />
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
              areaList={selectedAreaData}
              onAreaSelect={handleAreaDetails}
              editMode={createPocket === "M" ? "polygon" : null}
              editAreaPocket={editAreaData}
              editAreaLoading={editAreaLoading}
              onEditComplete={handleAreaEdit}
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
