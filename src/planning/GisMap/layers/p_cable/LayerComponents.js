import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { Polyline } from "@react-google-maps/api";
import AddGisMapLayer from "planning/GisMap/components/AddGisMapLayer";
import { GisLayerForm } from "planning/GisMap/components/GisLayerForm";
import ElementDetailsTable from "planning/GisMap/components/ElementDetailsTable";

import {
  getLayerViewData,
  getPlanningMapStateData,
  getPlanningMapStateEvent,
} from "planning/data/planningGis.selectors";
import {
  INITIAL_ELEMENT_DATA,
  ELEMENT_FORM_TEMPLATE,
  LAYER_KEY,
} from "./configurations";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";
import { PLANNING_EVENT } from "planning/GisMap/utils";

import CableIcon from "assets/markers/line_pin.svg";
import EditGisLayer from "planning/GisMap/components/EditGisLayer";
import { zIndexMapping } from "../common/configuration";

// for Add tab and show pills on FE
export const getIcon = ({ color_on_map }) => CableIcon;

export const getOptions = ({ color_on_map }) => {
  return {
    strokeColor: color_on_map,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color_on_map,
    fillOpacity: 1,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: zIndexMapping[LAYER_KEY],
  };
};

export const EditMapLayer = () => {
  const elemData = useSelector(getPlanningMapStateData);
  // get icon
  const options = getOptions(elemData);

  return (
    <EditGisLayer
      options={options}
      helpText="Click on map to create line on map. Double click to complete."
      featureType="polyline"
      layerKey={LAYER_KEY}
    />
  );
};

export const ElementForm = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
  const currEvent = useSelector(getPlanningMapStateEvent);
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  const transformAndValidateData = useCallback(
    (formData) => {
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
          // convert select fields to simple values
          configuration: configuration.id,
        };
      } else {
        return {
          ...formData,
          // AddGisMapLayer will give transformed coordinates in geometry field
          // convert select fields to simple values
          configuration: configuration.id,
        };
      }
    },
    [isEdit]
  );

  return (
    <GisLayerForm
      isConfigurable
      isEdit={isEdit}
      layerKey={LAYER_KEY}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
