import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { filter, get, size } from "lodash";
import { useSelector } from "react-redux";

import { Polygon, Marker } from "@react-google-maps/api";
import { Container, Paper, Box, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Map from "components/common/Map";
import ComingSoon from "components/common/ComingSoon";

import { fetchGeoSurveyBoundaryList } from "./geo_survey.service";
import { coordsToLatLongMap } from "utils/map.utils";
import { COLORS } from "App/theme";
import { getContentHeight } from "redux/selectors/appState.selectors";
import { getIsSuperAdminUser } from "redux/selectors/auth.selectors";
import { featureCollection, point, concave } from "@turf/turf";

const GeoSurveyPage = () => {
  const { isLoading, data } = useQuery(
    "geoSurveyBoundaryList",
    fetchGeoSurveyBoundaryList,
    { initialData: [] }
  );
  const contentHeight = useSelector(getContentHeight);

  const surveyList = useMemo(() => {
    let result = [...data];
    // convert work_orders coordinate, tags data
    for (let s_ind = 0; s_ind < result.length; s_ind++) {
      const survey = result[s_ind];
      const { units } = survey;
      // convert work_orders.units coordinate, tags data
      survey.coordinates = coordsToLatLongMap(survey.coordinates);
      survey.center = coordsToLatLongMap([survey.center])[0];
      survey.home_pass = 0;
      for (let u_ind = 0; u_ind < units.length; u_ind++) {
        const unit = units[u_ind];
        // convert work_orders.units coordinate, tags data
        unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
        // unit.tags = unit.tags.toString().split(",");
        survey.home_pass += get(unit, "total_home_pass", 0);
      }
    }
    return result;
  }, [data]);

  // Set states
  const [mapCenter, setMapCenter] = useState(undefined);
  const [selectedBoundaries, setSelectedBoundaries] = useState(new Set([]));
  const [homePass, setHomePass] = useState(0);
  const [areaPolyCoords, setAreaPolyCoords] = useState([]);

  // data handlers
  const handleUpdateMapCenter = useCallback((newCenter) => {
    setMapCenter(newCenter);
  }, []);

  const handleSurveyClick = useCallback(
    (survey) => {
      setSelectedBoundaries((surveySet) => {
        let newSet = new Set(surveySet);
        if (newSet.has(survey.id)) {
          newSet.delete(survey.id);
          setHomePass((currHP) => currHP - survey.home_pass);
        } else {
          newSet.add(survey.id);
          setHomePass((currHP) => currHP + survey.home_pass);
        }
        return newSet;
      });
    },
    [setSelectedBoundaries, setHomePass, handleUpdateMapCenter]
  );

  const handleClearSelections = useCallback(() => {
    setSelectedBoundaries(new Set([]));
    setHomePass(0);
    setAreaPolyCoords([]);
  }, []);

  const generateAreaPocket = useCallback(() => {
    // get all the selected survey data list
    const selectedSurveyList = filter(surveyList, function (s_data) {
      return selectedBoundaries.has(s_data.id);
    });
    // create a list of points out of survey data list
    let pointList = [];
    for (let ssInd = 0; ssInd < selectedSurveyList.length; ssInd++) {
      const currSurvey = selectedSurveyList[ssInd];
      const newPointList = currSurvey.coordinates.map((location) => {
        return point([location.lng, location.lat]);
      });
      pointList = pointList.concat(newPointList);
    }
    // create turf feature collection
    const tf_featCollections = featureCollection(pointList);
    // create concave polygon
    var tf_hull = concave(tf_featCollections, {
      units: "kilometers",
      maxEdge: 1,
    });
    // get coordinates of polygon and convert to latlongMap
    let newAreaPolyCoords = [];
    if (tf_hull.geometry.type === "MultiPolygon") {
      newAreaPolyCoords = coordsToLatLongMap(
        get(tf_hull, "geometry.coordinates.0.0")
      );
    } else {
      newAreaPolyCoords = coordsToLatLongMap(tf_hull.geometry.coordinates[0]);
    }
    // set in state to show on Map
    setAreaPolyCoords(newAreaPolyCoords);
  }, [surveyList, selectedBoundaries]);

  return (
    <Container sx={{ height: contentHeight, py: 2 }}>
      <Paper sx={{ height: "100%", position: "relative" }}>
        {!!homePass ? (
          <div className="reg-map-details">
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Total Home Pass <b>{homePass}</b>
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  disableElevation
                  color="success"
                  size="small"
                  onClick={generateAreaPocket}
                >
                  Set Area
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  color="error"
                  size="small"
                  onClick={handleClearSelections}
                >
                  Clear
                </Button>
              </CardActions>
            </Card>
          </div>
        ) : null}
        <Map center={mapCenter} zoom={13}>
          {!!size(areaPolyCoords) ? (
            <Polygon
              options={{
                fillColor: COLORS.success.main,
                fillOpacity: 0.4,
                strokeColor: COLORS.success.main,
                strokeOpacity: 1,
                strokeWeight: 1,
                clickable: true,
                draggable: true,
                editable: true,
                geodesic: false,
                zIndex: 1,
              }}
              paths={areaPolyCoords}
            />
          ) : null}
          {surveyList.map((survey) => {
            const { id, coordinates, units } = survey;
            const isSelected = selectedBoundaries.has(id);
            const color = isSelected ? COLORS.error.main : COLORS.primary.main;

            return (
              <React.Fragment key={id}>
                <Polygon
                  options={{
                    fillColor: color,
                    fillOpacity: 0.4,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    clickable: true,
                    draggable: false,
                    editable: false,
                    geodesic: false,
                    zIndex: 2,
                  }}
                  paths={coordinates}
                  onClick={() => handleSurveyClick(survey)}
                />
                {/* {units.map((unit) => {
                  const { id, coordinates } = unit;

                  return <Marker key={id} position={coordinates} />;
                })} */}
              </React.Fragment>
            );
          })}
        </Map>
      </Paper>
    </Container>
  );
};

const GeoSurveyPageWrapper = () => {
  const isSuperAdmin = useSelector(getIsSuperAdminUser);
  const contentHeight = useSelector(getContentHeight);

  if (isSuperAdmin) {
    return <GeoSurveyPage />;
  } else {
    return <ComingSoon contentHeight={contentHeight} />;
  }
};

export default GeoSurveyPageWrapper;
