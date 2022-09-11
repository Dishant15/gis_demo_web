import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Polyline } from "@react-google-maps/api";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import {
  INITIAL_ELEMENT_DATA,
  ELEMENT_FORM_TEMPLATE,
  LAYER_KEY,
} from "./configurations";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";

// for Add tab and show pills on FE
export const getIcon = ({ color_on_map }) => PrimarySpliterIcon;

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
