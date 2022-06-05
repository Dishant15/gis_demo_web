import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { find, isNull, orderBy, pick } from "lodash";

import { Box, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Loader from "components/common/Loader";
import RegionMap from "./components/RegionMap";
import AddRegionForm from "./components/AddRegionForm";

import { fetchRegionList } from "./data/services";
import {
  coordsToLatLongMap,
  latLongMapToCoords,
  DEFAULT_MAP_CENTER,
} from "utils/map.utils";
import Api from "utils/api.utils";
import { apiPutRegionEdit } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import { getFillColor } from "../utils/map.utils";

import "./styles/region-page.scss";

/**
 * Fetch region list
 * render region list sidebar
 * render RegionMap
 * user can select multiple region to show on map
 * user can see region data on popup
 * user can edit selected region coordinates , update details in popup
 * user can add new region, add details in popup
 *
 * Parent
 *  App
 *
 * Renders
 *  RegionMap
 *  AddRegionForm
 */
const RegionPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery("regionList", fetchRegionList, {
    initialData: [],
  });

  const regionListData = useMemo(() => {
    let resultData = data;
    resultData = resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      return d;
    });
    resultData = orderBy(resultData, ["created_on"], ["desc"]);
    return resultData;
  }, [data]);

  const { mutate, isLoading: editRegionLoading } = useMutation(
    (formData) => {
      Api.put(apiPutRegionEdit(formData.id), formData);
    },
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            title: "Region update",
            text: "Region coordinates updated successfully",
          })
        );
        setTimeout(() => {
          queryClient.invalidateQueries("regionList");
        }, 100);
      },
    }
  );
  // set map center
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
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
      // setMapCenter(areaData.path[0]);
      setCreatePocket("E");
      // clear selected area popups if any
      setShowAreaDetails(null);
    },
    []
  );

  const handleAreaEdit = useCallback((areaData) => {
    // update data to be in form of server submit
    let submitData = pick(areaData, ["id", "name", "unique_id"]);
    submitData.coordinates = latLongMapToCoords(areaData.coordinates);
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
      return regionListData.filter((d) => selectedArea.has(d.id));
    } else {
      return [];
    }
  }, [selectedArea, regionListData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div id="region-page" className="page-wrapper">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            <div className="reg-list-header-pill">Regions</div>

            {data.map((region) => {
              const { id, name, layer } = region;
              const color = getFillColor(layer);
              const isActive = selectedArea.has(id);
              const isEdit = editAreaData?.id === id;

              return (
                <Box className={`reg-list-pill`} key={id}>
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
                      <Box onClick={startEditArea(region)}>
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
              Create Region
            </Button>
          </div>
        </div>

        <div className="reg-content">
          <div className="reg-map-container">
            <RegionMap
              areaList={selectedAreaData}
              mapCenter={mapCenter}
              onAreaSelect={handleAreaDetails}
              editMode={createPocket === "M" ? "polygon" : null}
              editAreaPocket={editAreaData}
              editRegionLoading={editRegionLoading}
              onEditComplete={handleAreaEdit}
              onDrawComplete={() => setCreatePocket("E")}
              onSubmit={handleMapSubmit}
              onCancel={resetAllSelection}
            />
            {createPocket === "D" ? (
              <div className="reg-map-details">
                <AddRegionForm
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
              <div className="reg-map-details">
                <AddRegionForm
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

export default RegionPage;
