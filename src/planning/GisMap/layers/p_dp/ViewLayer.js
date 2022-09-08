import React from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
import DynamicForm from "components/common/DynamicForm";
import PDPViewIcon from "assets/markers/p_dp_view.svg";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { FORM_CONFIGS, LAYER_KEY } from "./configurations";
import { MAP_STATE } from "planning/GisMap/utils";

export const Geometry = ({ coordinates }) => (
  <Marker icon={{ url: PDPViewIcon }} position={coordinates} />
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
        return (
          <Marker icon={{ url: PDPViewIcon }} key={id} position={coordinates} />
        );
      })}
    </>
  );
};

export const AddLayer = () => {
  return (
    <AddMarkerLayer
      icon={PDPViewIcon}
      helpText="Click on map to add new Distribution Point location"
      nextEvent={{
        event: MAP_STATE.showElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data will be updated by addElement event
      }}
    />
  );
};

export const ElementForm = () => {
  const onSubmit = () => {};
  const onClose = () => {};
  const isLoading = false;

  return (
    <DynamicForm
      formConfigs={FORM_CONFIGS}
      onSubmit={onSubmit}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};
