import React, { useEffect, useRef } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";

import { GOOGLE_MAP_KEY } from "../../utils/constant";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ...</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const AreaPocketMap = ({ surveyList }) => {
  const center = { lat: 23.033863, lng: 72.585022 };
  const zoom = 13;
  const ref = useRef();
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!!mapRef.current) {
      mapRef.current.data.addGeoJson({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              // this is what django returns
              type: "Polygon",
              coordinates: [
                [
                  [72.49792098999023, 23.041311838604727],
                  [72.50616073608398, 23.040600986454287],
                  [72.5071907043457, 23.040640478338837],
                  [72.51148223876955, 23.039139778587646],
                  [72.51667499542236, 23.04960483650708],
                  [72.51950740814209, 23.0582132178783],
                  [72.51530170440674, 23.05923986882357],
                  [72.50294208526611, 23.054501414513844],
                  [72.50091433525085, 23.052892276467148],
                  [72.49929428100586, 23.050592064146844],
                  [72.49792098999023, 23.041311838604727],
                ],
              ],
            },
          },
        ],
      });
    }
  }, [surveyList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mapRef.current.data.setControls(null);
    mapRef.current.data.toGeoJson((data) => {
      console.log("🚀 ~ file: survey.js ~ line 38 ~ handleSubmit ~ data", data);
    });
  };

  return (
    <div className="survey-page page-wrapper">
      <Wrapper apiKey={GOOGLE_MAP_KEY} libraries={["drawing"]} render={render}>
        <div ref={ref} id="map" />
      </Wrapper>
    </div>
  );
};
export default AreaPocketMap;
