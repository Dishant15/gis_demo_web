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
import { zIndexMapping } from "../common/configuration";
import ListElementConnections from "../common/ListElementConnections";
import AddElementConnection from "../common/AddElementConnection";

export const getIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon;

export const getEditIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterEditIcon : SecondarySpliterEditIcon;

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
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

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

export const ElementConnections = () => {
  const elemData = useSelector(getPlanningMapStateData);
  return <ListElementConnections layerKey={LAYER_KEY} {...elemData} />;
};

export const LayerAddConnection = () => {
  return <AddElementConnection />;
};
