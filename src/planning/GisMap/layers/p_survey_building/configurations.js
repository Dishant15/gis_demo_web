import { LAYER_STATUS_OPTIONS } from "../common/configuration";

export const LAYER_KEY = "p_survey_building";

export const BUILDING_CATEGORY_OPTIONS = [
  { value: "M", label: "MDU" },
  { value: "S", label: "SDU" },
];

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  tags: "",
  category: { value: "M", label: "MDU" },
  floors: 0,
  house_per_floor: 0,
  total_home_pass: 0,
  unique_id: "REG_DP_",
  ref_code: "",
  status: { value: "P", label: "Planned" },
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {};
