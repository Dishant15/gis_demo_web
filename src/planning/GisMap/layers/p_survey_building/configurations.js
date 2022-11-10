import { FEATURE_TYPES } from "../common/configuration";

import { default as Icon } from "assets/markers/building_view.svg";
import { default as EditIcon } from "assets/markers/building_pin.svg";

export const LAYER_KEY = "p_survey_building";
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
  unique_id: "REG_SB_",
  ref_code: "",
  status: "P",
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {};
