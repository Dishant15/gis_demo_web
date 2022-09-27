import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { Marker } from "@react-google-maps/api";
import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
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
import { latLongMapToCoords } from "utils/map.utils";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import PrimarySpliterEditIcon from "assets/markers/spliter_edit_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";
import SecondarySpliterEditIcon from "assets/markers/spliter_edit.svg";
import EditGisLayer from "planning/GisMap/components/EditGisLayer";

export const getIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon;

export const getEditIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterEditIcon : SecondarySpliterEditIcon;

export const Geometry = ({ coordinates, splitter_type }) => {
  return (
    <Marker
      icon={{
        url: getIcon({ splitter_type }),
      }}
      position={coordinates}
    />
  );
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
        const { id, coordinates, splitter_type, hidden } = element;
        if (hidden) return null;
        return (
          <Geometry
            key={id}
            splitter_type={splitter_type}
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
  const Icon = getEditIcon(configuration);

  return (
    <AddMarkerLayer
      icon={Icon}
      helpText="Click on map to add new Splitter"
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
  const elemData = useSelector(getPlanningMapStateData);
  // get icon
  const Icon = getEditIcon(elemData);

  return (
    <EditGisLayer
      icon={Icon}
      helpText="Click or drag and drop splitter marker to new location"
      layerKey={LAYER_KEY}
      featureType="marker"
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
          configuration: configuration.id,
        };
      } else {
        return {
          ...formData,
          // remove coordinates and add geometry
          coordinates: undefined,
          geometry: latLongMapToCoords([formData.coordinates])[0],
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
  { label: "Splitter Type", field: "splitter_type_display", type: "simple" },
  { label: "Address", field: "address", type: "simple" },
  { label: "Ratio", field: "ratio", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
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
