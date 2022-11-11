import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { Polygon } from "@react-google-maps/api";
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
import { PLANNING_EVENT } from "planning/GisMap/utils";

import EditGisLayer from "planning/GisMap/components/EditGisLayer";
import { zIndexMapping } from "../common/configuration";

const STROKE_COLOR = "#CE855A";

export const getOptions = ({ hidden = false }) => {
  return {
    strokeColor: STROKE_COLOR,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: STROKE_COLOR,
    fillOpacity: 0.3,
    clickable: false,
    draggable: false,
    editable: false,
    visible: !hidden,
    zIndex: zIndexMapping[LAYER_KEY],
  };
};

export const EditMapLayer = () => {
  const options = getOptions({});

  return (
    <EditGisLayer
      options={options}
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      featureType="polygon"
      layerKey={LAYER_KEY}
    />
  );
};

export const ElementForm = () => {
  const currEvent = useSelector(getPlanningMapStateEvent);
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  const transformAndValidateData = useCallback(
    (formData) => {
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
        };
      } else {
        return formData;
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
