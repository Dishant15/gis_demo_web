import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useDispatch } from "react-redux";

import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { setMapPosition } from "planning/data/planningGis.reducer";
import { addNotification } from "redux/reducers/notification.reducer";

const MapSearchbox = () => {
  const dispatch = useDispatch();
  const autoComplete = useRef();

  const onLoad = (autoCompleteEvent) => {
    autoComplete.current = autoCompleteEvent;
  };

  const onPlaceChanged = () => {
    if (autoComplete && autoComplete.current) {
      // get all places details
      const place = autoComplete.current.getPlace();
      // get place location;
      const location = place.geometry.location.toJSON();
      dispatch(
        setMapPosition({
          center: location,
          zoom: 18,
        })
      );
    } else {
      dispatch(
        addNotification({
          type: "error",
          title: "Autocomplete is not loaded yet!",
        })
      );
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Paper
        elevation={2}
        sx={{
          position: "relative",
          width: "30%",
          height: "42px",
          marginLeft: "auto",
          marginRight: "64px",
          marginTop: "10px",
          paddingLeft: 1,
          paddingRight: 0.5,
        }}
      >
        <InputBase
          label="Search"
          type="search"
          placeholder="search by location..."
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Paper>
    </Autocomplete>
  );
};

export default MapSearchbox;
