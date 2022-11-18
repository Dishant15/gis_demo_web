import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  FEATURE_TYPES,
} from "../common/configuration";

import { default as Icon } from "assets/markers/p_dp_view.svg";
import { default as EditIcon } from "assets/markers/p_dp_edit.svg";

export const LAYER_KEY = "p_dp";
export const PRE_UID = "DP";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = () => ({
  icon: Icon,
  pin: EditIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  unique_id: "REG_DP_",
  ref_code: "",
  status: "P",
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Distribution Point Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: "address",
          label: "Address",
          field_type: "textArea",
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Address", field: "address", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
  { label: "Reff Code", field: "ref_code", type: "simple" },
  { label: "Status", field: "status", type: "status" },
];

export const transformAndValidateData = (formData, setError, isEdit) => {
  if (isEdit) {
    return {
      ...formData,
      // remove geometry
      geometry: undefined,
    };
  } else {
    return {
      ...formData,
      // remove coordinates and add geometry
      coordinates: undefined,
    };
  }
};
