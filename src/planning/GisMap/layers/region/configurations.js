import React from "react";

import { getFillColor } from "utils/map.utils";
import {
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";

import Icon from "assets/markers/pentagon.svg";

export const LAYER_KEY = "region";
// never use this to generate region, this will be given by user
export const PRE_UID = "RGN";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.MULTI_POLYGON;

export const getViewOptions = (props = {}) => {
  const { layer } = props;
  const color = getFillColor(layer);

  return {
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.3,
    clickable: false,
    draggable: false,
    editable: false,
    icon: Icon,
    pin: Icon,
  };
};

export const ELEMENT_TABLE_FIELDS = [...ELEMENT_TABLE_ABSTRACT_FIELDS];
