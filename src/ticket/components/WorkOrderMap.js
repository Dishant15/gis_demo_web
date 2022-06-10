import React from "react";
import { Box } from "@mui/material";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

const WorkOrderMap = ({
  areaPocket = null,
  surveyList,
  highlightSurvey,
  onSurveySelect,
}) => {
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
                fillColor: "#51ADAC",
                fillOpacity: 0.2,
                strokeColor: "#51ADAC",
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
            const { id, coordinates } = survey;
            const color = id === highlightSurvey ? "red" : "orange";
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
                onClick={onSurveySelect(id)}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default WorkOrderMap;
