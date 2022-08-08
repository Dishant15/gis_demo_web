import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { polygon, booleanContains } from "@turf/turf";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  get,
  find,
  groupBy,
  isNull,
  pick,
  map,
  difference,
  orderBy,
  size,
} from "lodash";

import { Box, Button, Divider, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import RegionMap from "./components/RegionMap";
import AddRegionForm from "./components/AddRegionForm";
import RegionListItem from "./components/RegionListItem";
import RegionDummyLoader from "./components/RegionDummyLoader";

import { fetchRegionList } from "./data/services";
import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";
import Api from "utils/api.utils";
import { apiPutRegionEdit } from "utils/url.constants";
import { addNotification } from "redux/reducers/notification.reducer";
import { checkUserPermission } from "redux/selectors/auth.selectors";

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
  const canUserAddRegion = useSelector(checkUserPermission("region_add"));
  const canUserEditRegion = useSelector(checkUserPermission("region_edit"));

  const queryClient = useQueryClient();
  const polyRef = useRef(null);
  const { isLoading, data } = useQuery(
    "regionList",
    fetchRegionList
    // {staleTime: Infinity,}
  );

  const regionListData = useMemo(() => {
    let resultData = data || [];
    resultData = resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
      return d;
    });
    return resultData;
  }, [data]);

  const [regionGroupData, baseRegionList] = useMemo(() => {
    // group data by parent
    let resultGroupData = groupBy(regionListData, "parent");
    // get list of parent keys
    const keyList = Object.keys(resultGroupData).map((k) => {
      if (k === "null") return null;
      return Number(k);
    });
    // get all the parent key list that is not in regionListData ; e.x. null, or other
    // get list of ids
    const idList = map(regionListData, "id");
    // get difference on keyList and idList
    const mergeList = difference(keyList, idList);
    // concat list of all groups with unknown parents that is our base layer
    let baseRegionList = [];
    for (let mListInd = 0; mListInd < mergeList.length; mListInd++) {
      const rId = mergeList[mListInd];
      baseRegionList = baseRegionList.concat(resultGroupData[String(rId)]);
    }
    // order by layer
    baseRegionList = orderBy(baseRegionList, ["layer"], ["asc"]);
    // return cancat list as first base list to render
    return [resultGroupData, baseRegionList];
  }, [regionListData]);

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
  const [mapCenter, setMapCenter] = useState();
  // set of all selected area to show on map
  const [selectedRegion, setSelectedRegion] = useState(new Set([]));
  const [expandedRegions, setExpandedRegions] = useState(new Set([]));
  // show details on area list OR map polygon click
  const [showRegionDetails, setShowRegionDetails] = useState(null);
  // null : not creating, "M" : map, "E": edit, "D" : details
  const [createRegion, setCreateRegion] = useState(null);
  // set coordinates and parent Id of new Area that is being created
  const [newRegionCoords, setNewRegionCoords] = useState([]);
  const [newRegionParentId, setNewRegionParentId] = useState(null);
  // save edit state for area
  const [editRegionData, setEditRegionData] = useState(null);

  const handleUpdateMapCenter = useCallback((newCenter) => {
    setMapCenter(newCenter);
  }, []);

  const handleRegionDetails = useCallback(
    (regionId) => {
      if (isNull(createRegion)) {
        setShowRegionDetails(regionId);
      }
    },
    [setShowRegionDetails, createRegion]
  );

  const handleRegionClick = useCallback(
    (regionId, center) => {
      setSelectedRegion((regionSet) => {
        let newSet = new Set(regionSet);
        if (newSet.has(regionId)) {
          handleUpdateMapCenter(null);
          newSet.delete(regionId);
        } else {
          handleUpdateMapCenter(center);
          newSet.add(regionId);
        }
        return newSet;
      });
    },
    [setSelectedRegion, handleUpdateMapCenter]
  );

  const handleRegionExpandClick = (regionId, center) => () => {
    // get all children of region
    let regChildIdList = map(get(regionGroupData, regionId, []), "id");
    regChildIdList.push(regionId);
    setExpandedRegions((regionSet) => {
      let newSet = new Set(regionSet);
      if (newSet.has(regionId)) {
        newSet.delete(regionId);
        // remove children from selectedRegion
        setSelectedRegion((regSet) => {
          let newRegSet = new Set(regSet);
          regChildIdList.forEach(newRegSet.delete, newRegSet);
          return newRegSet;
        });
        // remove center so it can update
        handleUpdateMapCenter(null);
      } else {
        newSet.add(regionId);
        // add children to selectedRegion
        setSelectedRegion((regSet) => {
          let newRegSet = new Set(regSet);
          regChildIdList.forEach(newRegSet.add, newRegSet);
          return newRegSet;
        });
        // go to center
        handleUpdateMapCenter(center);
      }
      return newSet;
    });
  };

  const handleRegionCreate = useCallback(
    (parent = null, coordinates = []) =>
      () => {
        if (isNull(createRegion)) {
          // save parent coordinates for child coords validations
          polyRef.current = coordinates;
          setCreateRegion("M");
          setNewRegionParentId(parent);
          setShowRegionDetails(null);
        }
      },
    [createRegion]
  );

  const handleMapSubmit = useCallback((coords) => {
    let isContained = true;
    // if adding child check if valid child
    if (size(polyRef.current)) {
      const childCoords = latLongMapToCoords(coords);
      const childPoly = polygon([childCoords]);
      for (let parentInd = 0; parentInd < polyRef.current.length; parentInd++) {
        const currPoly = polyRef.current[parentInd];

        const parentCoords = latLongMapToCoords(currPoly);
        const parentPoly = polygon([parentCoords]);
        isContained = booleanContains(parentPoly, childPoly);
      }
    }
    polyRef.current = null;
    if (isContained) {
      // move page state to Detail form
      setCreateRegion("D");
      // add coordinates to state
      setNewRegionCoords(coords);
    } else {
      setCreateRegion(null);
      setNewRegionCoords([]);
      setNewRegionParentId(null);
      dispatch(
        addNotification({
          type: "error",
          title: "Input error",
          text: "Child Region polygon must be contained inside parent region",
        })
      );
    }
  }, []);

  const startEditRegion = useCallback(
    (regionData) => () => {
      handleUpdateMapCenter(regionData.center);
      setEditRegionData(regionData);
      // setMapCenter(regionData.path[0]);
      setCreateRegion("E");
      // clear selected region popups if any
      setShowRegionDetails(null);
    },
    [handleUpdateMapCenter]
  );

  const handleRegionEdit = useCallback(
    (regionData) => {
      // update data to be in form of server submit
      let submitData = pick(regionData, ["id", "name", "unique_id"]);
      submitData.coordinates = latLongMapToCoords(regionData.coordinates);
      submitData.parentId = regionData.parent;
      // update area data to server
      mutate(submitData);
      // reset edit area state
      setEditRegionData(null);
      setCreateRegion(null);
    },
    [mutate]
  );

  const resetAllSelection = useCallback(() => {
    setCreateRegion(null);
    setNewRegionCoords([]);
    setNewRegionParentId(null);
    setShowRegionDetails(null);
    setEditRegionData(null);
  }, []);

  const selectedRegionData = useMemo(() => {
    if (regionListData) {
      return regionListData.filter((d) => selectedRegion.has(d.id));
    } else {
      return [];
    }
  }, [selectedRegion, regionListData]);

  if (isLoading) {
    return <RegionDummyLoader />;
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
              {canUserAddRegion ? (
                <Button
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleRegionCreate(null)}
                >
                  New Region
                </Button>
              ) : null}
            </Stack>

            <Divider flexItem orientation="horizontal" />

            {baseRegionList.map((region) => {
              return (
                <RegionListItem
                  key={region.id}
                  region={region}
                  regionGroupData={regionGroupData}
                  selectedRegion={selectedRegion}
                  expandedRegions={expandedRegions}
                  handleRegionClick={handleRegionClick}
                  handleRegionDetails={handleRegionDetails}
                  handleRegionExpandClick={handleRegionExpandClick}
                  canUserEditRegion={canUserEditRegion}
                />
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
                  data={find(regionListData, ["id", showRegionDetails])}
                  onAreaCreate={resetAllSelection}
                  startEditRegion={startEditRegion}
                  handleRegionCreate={handleRegionCreate}
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
