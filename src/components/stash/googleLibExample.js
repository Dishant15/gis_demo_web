/**
 * example for library : @googlemaps/react-wrapper
 *
 * pros: gives native google apis to work with
 *
 * con: not a reactive library
 *      considerably hard to integrate with react prop and state updates
 */

import React, { useEffect, useRef } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";

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
  const featureRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });

    map.data.addListener("click", (event) => {
      console.log(
        "🚀 ~ file: AreaPocketMap.js ~ line 29 ~ map.data.addListener ~ event.feature.getId();",
        event.feature.getId()
      );
    });

    map.data.addListener("addfeature", (event) => {
      mapRef.current.data.setDrawingMode(null);
    });

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!!mapRef.current) {
      if (!!featureRef.current) {
        // empty map data
        for (let i = 0; i < featureRef.current.length; i++) {
          mapRef.current.data.remove(featureRef.current[i]);
        }
      }
      const mapFeatures = surveyList.map((survey) => {
        return {
          type: "Feature",
          geometry: survey.geo_json,
        };
      });
      featureRef.current = mapRef.current.data.addGeoJson({
        type: "FeatureCollection",
        features: mapFeatures,
      });
    }
  }, [surveyList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mapRef.current.data.setControls(null);
    mapRef.current.data.toGeoJson((data) => {});
  };

  return <div ref={ref} id="map" />;
};

const WrapperComponent = ({ surveyList }) => {
  return (
    <div className="survey-page page-wrapper">
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={["drawing"]}
        render={render}
      >
        <AreaPocketMap surveyList={surveyList} />
      </Wrapper>
    </div>
  );
};
export default WrapperComponent;
