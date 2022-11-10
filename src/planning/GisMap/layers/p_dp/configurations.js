import { FEATURE_TYPES, LAYER_STATUS_OPTIONS } from "../common/configuration";

export const LAYER_KEY = "p_dp";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

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
