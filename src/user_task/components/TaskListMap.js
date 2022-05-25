import React, { useRef } from "react";
import { Box } from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "../../utils/constant";
import { getFillColor } from "../../pages/AreaPocketPage/services";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

const TaskListMap = ({ areaPocket = null, surveyList, onSurveySelect }) => {
  return (
    <Box width="100%" height="100%">
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            // disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,
          }}
        >
          {!!areaPocket ? (
            <Polygon
              options={{
                fillColor: "red",
                fillOpacity: 0.2,
                strokeColor: "red",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: false,
                geodesic: false,
                zIndex: 1,
              }}
              paths={areaPocket.coordinates}
            />
          ) : null}
          {surveyList.map((survey) => {
            const { id, coordinates, g_layer } = survey;
            const color = getFillColor(g_layer);
            return (
              <Polygon
                key={id}
                options={{
                  fillColor: color,
                  fillOpacity: 0.3,
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
                onClick={() => {
                  onSurveySelect(id);
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default TaskListMap;
