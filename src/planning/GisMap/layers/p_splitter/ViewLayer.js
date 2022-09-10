import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import AddMarkerLayer from "planning/GisMap/components/AddMarkerLayer";
import { GisLayerForm } from "planning/GisMap/components/GisLayerForm";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import {
  INITIAL_ELEMENT_DATA,
  ELEMENT_FORM_TEMPLATE,
  LAYER_KEY,
} from "./configurations";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";
import { PLANNING_EVENT } from "planning/GisMap/utils";
import { latLongMapToCoords } from "utils/map.utils";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";

export const getIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon;

export const Geometry = ({ coordinates, splitterType }) => {
  return (
    <Marker
      icon={{
        url: getIcon({ splitter_type: splitterType }),
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
  const data = layerData.viewData;

  return (
    <>
      {data.map((splitter) => {
        const { id, coordinates, splitter_type } = splitter;
        return (
          <Geometry
            key={id}
            splitterType={splitter_type}
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
  const Icon = getIcon(configuration);

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

export const ElementForm = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));

  const transformAndValidateData = useCallback((formData) => {
    return {
      ...formData,
      // remove coordinates and add geometry
      coordinates: undefined,
      geometry: latLongMapToCoords([formData.coordinates])[0],
      // convert select fields to simple values
      status: formData.status.value,
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
