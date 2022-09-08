import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
import { GisLayerForm } from "planning/GisMap/components/GisLayerForm";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { FORM_CONFIGS, INITIAL_DATA, LAYER_KEY } from "./configurations";
import { MAP_STATE } from "planning/GisMap/utils";

import { default as Icon } from "assets/markers/p_dp_view.svg";
import { latLongMapToCoords } from "utils/map.utils";

export const Geometry = ({ coordinates }) => (
  <Marker icon={{ url: Icon }} position={coordinates} />
);

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map((dp) => {
        const { id, coordinates } = dp;
        return <Geometry key={id} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddLayer = () => {
  return (
    <AddMarkerLayer
      icon={Icon}
      helpText="Click on map to add new Distribution Point location"
      nextEvent={{
        event: MAP_STATE.showElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data
        data: INITIAL_DATA,
      }}
    />
  );
};

export const ElementForm = () => {
  const transformAndValidateData = useCallback((formData) => {
    return {
      ...formData,
      // remove coordinates and add geometry
      coordinates: undefined,
      geometry: latLongMapToCoords([formData.coordinates])[0],
      // convert select fields to simple values
      status: formData.status.value,
    };
  }, []);

  return (
    <GisLayerForm
      layerKey={LAYER_KEY}
      formConfig={FORM_CONFIGS}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
