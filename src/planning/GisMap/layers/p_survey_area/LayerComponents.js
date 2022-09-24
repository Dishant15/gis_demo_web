import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import find from "lodash/find";

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
  AREA_LOCALITY_OPTIONS,
} from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { LAYER_STATUS_OPTIONS } from "../common/configuration";

import EditGisLayer from "planning/GisMap/components/EditGisLayer";
import { map, split } from "lodash";

// const STROKE_COLOR = "#88B14B";
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
    zIndex: 1,
  };
};

export const Geometry = ({ coordinates, hidden }) => {
  const options = getOptions({ hidden });

  return <Polygon path={coordinates} options={options} />;
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > LayerKeyMaping.layerKey.ViewLayer
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));

  return (
    <>
      {layerData.map((element) => {
        const { id, hidden, coordinates } = element;

        return <Geometry key={id} hidden={hidden} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddMapLayer = () => {
  // get icon
  const options = getOptions({});

  return (
    <AddGisMapLayer
      options={options}
      featureType="polygon"
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
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
  const isEdit = currEvent === PLANNING_EVENT.editElementDetails;

  const transformAndValidateData = useCallback(
    (formData) => {
      const broadband_availability = Array.isArray(
        formData.broadband_availability
      )
        ? map(formData.broadband_availability, "value").join(",")
        : "";
      const cable_tv_availability = Array.isArray(
        formData.cable_tv_availability
      )
        ? map(formData.cable_tv_availability, "value").join(",")
        : "";
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
          // convert select fields to simple values
          status: formData.status.value,
          locality_status: formData.locality_status.value,
          broadband_availability,
          cable_tv_availability,
        };
      } else {
        return {
          ...formData,
          // AddGisMapLayer will give transformed coordinates in geometry field
          // convert select fields to simple values
          status: formData.status.value,
          locality_status: formData.locality_status.value,
          broadband_availability,
          cable_tv_availability,
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
  { label: "Address", field: "address", type: "simple" },
  { label: "Area", field: "area", type: "simple" },
  { label: "City", field: "city", type: "simple" },
  { label: "State", field: "state", type: "simple" },
  { label: "Pincode", field: "pincode", type: "simple" },
  { label: "Tags", field: "tags", type: "simple" },
  { label: "Home Pass", field: "home_pass", type: "simple" },
  { label: "Over Head Cable", field: "over_head_cable", type: "boolean" },
  { label: "Cabling Required", field: "cabling_required", type: "boolean" },
  {
    label: "Poll Cabling possible",
    field: "poll_cabling_possible",
    type: "boolean",
  },
  {
    label: "Locality Status",
    field: "locality_status_display",
    type: "simple",
  },
  // multi select comma separeted string
  {
    label: "Broadband Availability",
    field: "broadband_availability",
    type: "simple",
  },
  {
    label: "Cable Tv Availability",
    field: "cable_tv_availability",
    type: "simple",
  },
  { label: "Status", field: "status", type: "status" },
];

const convertDataBeforeForm = (data) => {
  return {
    ...data,
    // convert status to select format
    status: find(LAYER_STATUS_OPTIONS, ["value", data.status]),
    locality_status: find(AREA_LOCALITY_OPTIONS, [
      "value",
      data.locality_status,
    ]),
    broadband_availability: split(data.broadband_availability, ",").map(
      (v) => ({ label: v, value: v })
    ),
    cable_tv_availability: split(data.cable_tv_availability, ",").map((v) => ({
      label: v,
      value: v,
    })),
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
