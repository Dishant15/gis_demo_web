import React, { useRef, useState } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MapComponent from "../../components/MapComponent";

import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";

import Api from "../../utils/api.utils";
import { GOOGLE_MAP_KEY } from "../../utils/constant";
import { apiAddArea } from "../../utils/url.constants";

import "./Survey.css";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ...</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const Survey = () => {
  const [steps, setSteps] = useState(1);
  const center = { lat: 23.033863, lng: 72.585022 };
  const zoom = 13;
  const ref = useRef();
  const mapRef = useRef();

  const handleSetDrawingMode = () => {
    mapRef.current.data.setControls(["Point", "LineString", "Polygon"]);
    // submit
    setSteps(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mapRef.current.data.setControls(null);
    mapRef.current.data.toGeoJson((data) => {
      console.log("🚀 ~ file: survey.js ~ line 38 ~ handleSubmit ~ data", data);
      Api.post(apiAddArea(), data)
        .then((res) => console.log("res", res))
        .catch((err) => console.log("err", err));
    });
  };

  let fabContent = null;
  if (steps === 1) {
    fabContent = (
      <Fab
        className="fab-btn"
        color="secondary"
        aria-label="edit"
        variant="extended"
        onClick={handleSetDrawingMode}
      >
        <EditIcon />
        Start Drawing
      </Fab>
    );
  } else if (steps === 2) {
    fabContent = (
      <Fab
        className="fab-btn"
        color="primary"
        aria-label="submit"
        variant="extended"
        onClick={handleSubmit}
      >
        <SendIcon />
        Submit
      </Fab>
    );
  }

  return (
    <div className="survey-page">
      <Wrapper apiKey={GOOGLE_MAP_KEY} libraries={["drawing"]} render={render}>
        <MapComponent center={center} zoom={zoom} ref={ref} mapRef={mapRef} />
        {fabContent}
      </Wrapper>
    </div>
  );
};
export default Survey;
