import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import find from "lodash/find";

import { Polyline } from "@react-google-maps/api";
import AddPolyLineLayer from "planning/GisMap/components/AddPolyLineLayer";
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
  CABLE_TYPE_OPTIONS,
} from "./configurations";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { LAYER_STATUS_OPTIONS } from "../common/configuration";

import CableIcon from "assets/markers/line_pin.svg";
import EditMarkerLayer from "planning/GisMap/components/EditGisLayer";

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

export const AddMapLayer = () => {
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

export const EditMapLayer = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
  // get icon
  const options = getOptions(configuration);

  return (
    <EditMarkerLayer
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
  const isEdit = currEvent === PLANNING_EVENT.editElementDetails;

  const transformAndValidateData = useCallback(
    (formData) => {
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
          // convert select fields to simple values
          status: formData.status.value,
          cable_type: formData.cable_type.value,
          configuration: configuration.id,
        };
      } else {
        return {
          ...formData,
          // AddPolyLineLayer will give transformed coordinates in geometry field
          // convert select fields to simple values
          status: formData.status.value,
          cable_type: formData.cable_type.value,
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

const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
  { label: "Reff Code", field: "ref_code", type: "simple" },
  { label: "Cable Type", field: "cable_type_display", type: "simple" },
  { label: "Gis Length", field: "gis_len", type: "simple" },
  { label: "Actual Length", field: "actual_len", type: "simple" },
  { label: "Start Reading", field: "start_reading", type: "simple" },
  { label: "End Reading", field: "end_reading", type: "simple" },
  { label: "No of tubes", field: "no_of_tube", type: "simple" },
  { label: "Core / Tube", field: "core_per_tube", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
  { label: "Status", field: "status", type: "status" },
];

const convertDataBeforeForm = (data) => {
  return {
    ...data,
    // convert status to select format
    status: find(LAYER_STATUS_OPTIONS, ["value", data.status]),
    cable_type: find(CABLE_TYPE_OPTIONS, ["value", data.cable_type]),
  };
};

export const ElementDetails = () => {
  const { elementId } = useSelector(getPlanningMapStateData);

  return (
    <ElementDetailsTable
      rowDefs={ELEMENT_TABLE_FIELDS}
      layerKey={LAYER_KEY}
      elementId={elementId}
      onEditDataConverter={convertDataBeforeForm}
    />
  );
};
