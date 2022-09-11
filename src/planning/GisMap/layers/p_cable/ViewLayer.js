import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { Polyline } from "@react-google-maps/api";
import AddPolyLineLayer from "planning/GisMap/components/AddPolyLineLayer";
import { GisLayerForm } from "planning/GisMap/components/GisLayerForm";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import {
  INITIAL_ELEMENT_DATA,
  ELEMENT_FORM_TEMPLATE,
  LAYER_KEY,
} from "./configurations";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { latLongMapToLineCoords } from "utils/map.utils";

import CableIcon from "assets/markers/line_pin.svg";

// for Add tab and show pills on FE
export const getIcon = ({ color_on_map }) => CableIcon;

export const getOptions = ({ color_on_map }) => {
  return {
    strokeColor: color_on_map,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color_on_map,
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
  };
};

export const Geometry = ({ coordinates, color_on_map }) => {
  const options = getOptions({ color_on_map });

  return <Polyline path={coordinates} options={options} />;
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > LayerKeyMaping.layerKey.ViewLayer
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map((element) => {
        const { id, coordinates, color_on_map } = element;
        return (
          <Geometry
            key={id}
            color_on_map={color_on_map}
            coordinates={coordinates}
          />
        );
      })}
    </>
  );
};

export const AddLayer = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
  // get icon
  const options = getOptions(configuration);

  return (
    <AddPolyLineLayer
      options={options}
      helpText="Click on map to create line on map. Double click to complete."
      nextEvent={{
        event: PLANNING_EVENT.showElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data
        data: INITIAL_ELEMENT_DATA,
      }}
    />
  );
};

export const ElementForm = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));

  const transformAndValidateData = useCallback((formData) => {
    return {
      ...formData,
      // remove coordinates and add geometry
      coordinates: undefined,
      geometry: latLongMapToLineCoords(formData.coordinates),
      // convert select fields to simple values
      status: formData.status.value,
      cable_type: formData.cable_type.value,
      configuration: configuration.id,
    };
  }, []);

  return (
    <GisLayerForm
      isConfigurable
      layerKey={LAYER_KEY}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
