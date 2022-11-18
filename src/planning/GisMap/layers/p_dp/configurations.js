import { FEATURE_TYPES, LAYER_STATUS_OPTIONS } from "../common/configuration";

import { default as Icon } from "assets/markers/p_dp_view.svg";
import { default as EditIcon } from "assets/markers/p_dp_edit.svg";
import { latLongMapToCoords } from "utils/map.utils";

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
        {
          field_key: "name",
          label: "Name",
          field_type: "input",
        },
        {
          field_key: "address",
          label: "Address",
          field_type: "textArea",
        },
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: "input",
          disabled: true,
        },
        {
          field_key: "network_id",
          label: "Network Id",
          field_type: "input",
          disabled: true,
        },
        {
          field_key: "status",
          label: "Status",
          field_type: "select",
          options: LAYER_STATUS_OPTIONS,
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
