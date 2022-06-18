import React from "react";
import { Box } from "@mui/material";
import { Polygon } from "@react-google-maps/api";

import Map from "components/common/Map";

const WorkOrderMap = ({
  areaPocket = null,
  surveyList,
  highlightSurvey,
  onSurveySelect,
}) => {
  return (
    <Box width="100%" height="100%">
      <Map>
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
      </Map>
    </Box>
  );
};

export default WorkOrderMap;
