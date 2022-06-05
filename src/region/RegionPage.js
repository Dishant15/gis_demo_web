import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { find, isNull, orderBy, pick } from "lodash";

import { Box, Button, Divider, IconButton, Stack } from "@mui/material";
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
        queryClient.invalidateQueries("regionList");
      },
    }
  );
  // set map center
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  // set of all selected area to show on map
  const [selectedRegion, setSelectedRegion] = useState(new Set([]));
  // show details on area list OR map polygon click
  const [showRegionDetails, setShowRegionDetails] = useState(null);
  // null : not creating, "M" : map, "E": edit, "D" : details
  const [createRegion, setCreateRegion] = useState(null);
  // set coordinates and parent Id of new Area that is being created
  const [newRegionCoords, setNewRegionCoords] = useState([]);
  const [newRegionParentId, setNewRegionParentId] = useState(null);
  // save edit state for area
  const [editRegionData, setEditRegionData] = useState(null);

  const handleRegionDetails = useCallback(
    (regionId) => {
      if (isNull(createRegion)) {
        setShowRegionDetails(regionId);
      }
    },
    [setShowRegionDetails, createRegion]
  );

  const handleRegionClick = useCallback(
    (regionId) => {
      setSelectedRegion((regionSet) => {
        let newSet = new Set(regionSet);
        if (newSet.has(regionId)) {
          newSet.delete(regionId);
          // remove survey details
          if (regionId === showRegionDetails) {
            handleRegionDetails(null);
          }
        } else {
          newSet.add(regionId);
          handleRegionDetails(regionId);
        }
        return newSet;
      });
    },
    [showRegionDetails]
  );

  const handleRegionCreate = useCallback((step, parent = null) => {
    setCreateRegion(step);
    setNewRegionParentId(parent);
    setShowRegionDetails(null);
  }, []);

  const handleMapSubmit = useCallback((coords) => {
    // move page state to Detail form
    setCreateRegion("D");
    // add coordinates to state
    setNewRegionCoords(latLongMapToCoords(coords));
  }, []);

  const startEditRegion = useCallback(
    (regionData) => () => {
      setEditRegionData(regionData);
      // setMapCenter(regionData.path[0]);
      setCreateRegion("E");
      // clear selected region popups if any
      setShowRegionDetails(null);
    },
    []
  );

  const handleRegionEdit = useCallback((regionData) => {
    // update data to be in form of server submit
    let submitData = pick(regionData, ["id", "name", "unique_id"]);
    submitData.coordinates = latLongMapToCoords(regionData.coordinates);
    submitData.parentId = regionData.parent;
    // update area data to server
    mutate(submitData);
    // reset edit area state
    setEditRegionData(null);
    setCreateRegion(null);
  }, []);

  const resetAllSelection = useCallback(() => {
    setCreateRegion(null);
    setNewRegionCoords([]);
    setNewRegionParentId(null);
    setShowRegionDetails(null);
    setEditRegionData(null);
  }, []);

  const selectedRegionData = useMemo(() => {
    if (data) {
      return regionListData.filter((d) => selectedRegion.has(d.id));
    } else {
      return [];
    }
  }, [selectedRegion, regionListData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div id="region-page" className="page-wrapper">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            <Stack px={2} direction="row">
              <Box
                color="primary.dark"
                flex={1}
                className="reg-list-header-pill"
              >
                Regions
              </Box>
              <Button
                color="success"
                startIcon={<AddIcon />}
                onClick={() => {
                  if (isNull(createRegion)) {
                    handleRegionCreate("M", null);
                  }
                }}
              >
                Create Region
              </Button>
            </Stack>

            <Divider flexItem orientation="horizontal" />

            {data.map((region) => {
              const { id, name, layer } = region;
              const color = getFillColor(layer);
              const isActive = selectedRegion.has(id);
              const isEdit = editRegionData?.id === id;

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
                      <Box onClick={() => handleRegionClick(id)}>
                        <IconButton aria-label="add-area-pocket" size="small">
                          <VisibilityIcon
                            color={isActive ? "secondary" : "inherit"}
                          />
                        </IconButton>
                      </Box>
                      <Box onClick={startEditRegion(region)}>
                        <IconButton aria-label="add-area-pocket" size="small">
                          <EditIcon color={isEdit ? "secondary" : "inherit"} />
                        </IconButton>
                      </Box>
                    </Stack>
                    <Box
                      onClick={() => {
                        if (isNull(createRegion)) {
                          handleRegionCreate("M", id);
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
          </div>
        </div>

        <div className="reg-content">
          <div className="reg-map-container">
            <RegionMap
              regionList={selectedRegionData}
              mapCenter={mapCenter}
              onRegionSelect={handleRegionDetails}
              editMode={createRegion === "M" ? "polygon" : null}
              editRegionPocket={editRegionData}
              editRegionLoading={editRegionLoading}
              onEditComplete={handleRegionEdit}
              onDrawComplete={() => setCreateRegion("E")}
              onSubmit={handleMapSubmit}
              onCancel={resetAllSelection}
            />
            {createRegion === "D" ? (
              <div className="reg-map-details">
                <AddRegionForm
                  key="add"
                  data={{
                    coordinates: newRegionCoords,
                    parentId: newRegionParentId,
                  }}
                  onAreaCreate={resetAllSelection}
                />
              </div>
            ) : null}
            {isNull(showRegionDetails) ? null : (
              <div className="reg-map-details">
                <AddRegionForm
                  key={showRegionDetails}
                  data={find(data, ["id", showRegionDetails])}
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
