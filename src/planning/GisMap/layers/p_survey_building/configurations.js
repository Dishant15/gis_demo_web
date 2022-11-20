import {
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";

import { default as Icon } from "assets/markers/building_view.svg";
import { default as EditIcon } from "assets/markers/building_pin.svg";

export const LAYER_KEY = "p_survey_building";
export const PRE_UID = "SB";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = () => ({
  icon: Icon,
  pin: EditIcon,
});

export const BUILDING_CATEGORY_OPTIONS = [
  { value: "M", label: "MDU" },
  { value: "S", label: "SDU" },
];

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  tags: "",
  category: "M",
  floors: 0,
  house_per_floor: 0,
  total_home_pass: 0,
  unique_id: "",
  network_id: "",
  ref_code: "",
  status: "RFS",
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {};

export const ELEMENT_TABLE_FIELDS = [
  { label: "Boundary Name", field: "boundary_name", type: "simple" },
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Address", field: "address", type: "simple" },
  { label: "Tags", field: "tags", type: "simple" },
  { label: "Categories", field: "category_display", type: "simple" },
  { label: "Floors", field: "floors", type: "simple" },
  { label: "House Per Floor", field: "house_per_floor", type: "simple" },
  { label: "Total Home Pass", field: "total_home_pass", type: "simple" },
];
