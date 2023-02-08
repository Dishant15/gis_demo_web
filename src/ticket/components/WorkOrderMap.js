import React from "react";

import { Polygon } from "@react-google-maps/api";
import { Box } from "@mui/material";

import Map from "components/common/Map";
import { RedMarker } from "components/common/Map/CustomMarkers";

const WorkOrderMap = (props) => {
  const { areaPocket = null, surveyList, onSurveySelect, center } = props;

  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        position: "relative",
      }}
    >
      <Map center={center} zoom={14}>
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
          const { id, lat, long: lng } = survey;
          return (
            <RedMarker
              key={id}
              position={{ lat, lng }}
              onClick={onSurveySelect(id)}
            />
          );
        })}
      </Map>
    </Box>
  );
};

export default WorkOrderMap;
