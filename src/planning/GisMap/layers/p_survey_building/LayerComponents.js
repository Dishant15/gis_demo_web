import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import { map } from "lodash";

import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
import { BuildingLayerForm } from "./BuildingLayerForm";

import {
  getLayerViewData,
  getPlanningMapStateData,
  getPlanningMapStateEvent,
} from "planning/data/planningGis.selectors";
import { INITIAL_ELEMENT_DATA, LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { latLongMapToCoords } from "utils/map.utils";

import ElementDetailsTable from "planning/GisMap/components/ElementDetailsTable";
import EditMarkerLayer from "planning/GisMap/components/EditGisLayer";
import { default as Icon } from "assets/markers/p_dp_view.svg";
import { default as EditIcon } from "assets/markers/p_dp_edit.svg";

export const Geometry = ({ coordinates }) => (
  <Marker icon={{ url: Icon }} position={coordinates} />
);

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
        if (hidden) return null;
        return <Geometry key={id} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddMapLayer = () => {
  return (
    <AddMarkerLayer
      icon={EditIcon}
      helpText="Click on map to add new Distribution Point location"
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
  return (
    <EditMarkerLayer
      icon={EditIcon}
      helpText="Click or drag and drop marker to new location"
      layerKey={LAYER_KEY}
      featureType="marker"
    />
  );
};

export const ElementForm = () => {
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementDetails;
  // transform and validate data according to that
  const transformAndValidateData = useCallback(
    (formData) => {
      const tags = Array.isArray(formData.tags)
        ? map(formData.tags, "value").join(",")
        : "";
      if (isEdit) {
        return {
          ...formData,
          // remove coordinates
          geometry: undefined,
          // convert select fields to simple values
          tags,
          address: "",
        };
      } else {
        return {
          ...formData,
          // remove coordinates and add geometry
          geometry: latLongMapToCoords([formData.coordinates])[0],
          // convert select fields to simple values
          tags,
          address: "",
        };
      }
    },
    [isEdit]
  );

  return (
    <BuildingLayerForm
      isEdit={isEdit}
      layerKey={LAYER_KEY}
      formConfig={{}}
      transformAndValidateData={transformAndValidateData}
    />
  );
};

const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Address", field: "address", type: "simple" },
  { label: "Tags", field: "tags", type: "simple" },
  { label: "Categories", field: "category_display", type: "simple" },
  { label: "Floors", field: "floors", type: "simple" },
  { label: "House Per Floor", field: "house_per_floor", type: "simple" },
  { label: "Total Home Pass", field: "total_home_pass", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
  { label: "Reff Code", field: "ref_code", type: "simple" },
  { label: "Status", field: "status", type: "status" },
];

const convertDataBeforeForm = (data) => {
  return data;
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
