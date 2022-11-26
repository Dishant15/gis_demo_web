import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";
import { FIELD_TYPES } from "components/common/DynamicForm";

import { default as Icon } from "assets/markers/dsa.svg";

export const LAYER_KEY = "p_dsa";
export const PRE_UID = "DSA";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

export const getViewOptions = () => ({
  icon: Icon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  unique_id: "",
  network_id: "",
  ref_code: "",
  status: "RFS",
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "DSA Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: "survey_area_count",
          label: "Survey Area Count",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "building_count",
          label: "Building Count",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "home_pass",
          label: "Home Pass",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "area",
          label: "Area",
          field_type: FIELD_TYPES.Input,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Survey Area Count", field: "survey_area_count", type: "simple" },
  { label: "Building Count", field: "building_count", type: "simple" },
  { label: "Home Pass", field: "home_pass", type: "simple" },
  { label: "Area", field: "area", type: "simple" },
];
