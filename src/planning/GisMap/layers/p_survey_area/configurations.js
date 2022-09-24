import { FIELD_TYPES } from "components/common/DynamicForm";
import { LAYER_STATUS_OPTIONS } from "../common/configuration";

export const LAYER_KEY = "p_survey_area";

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "REG_SA_",
  ref_code: "",
  status: { value: "P", label: "Planned" },
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  tags: "",
  over_head_cable: false,
  cabling_required: false,
  poll_cabling_possible: false,
  locality_status: "3",
  broadband_availability: "",
  cable_tv_availability: "",
  coordinates: [],
};

export const AREA_LOCALITY_OPTIONS = [
  { value: "1", label: "High" },
  { value: "2", label: "Medium" },
  { value: "3", label: "Average" },
  { value: "4", label: "Poor" },
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Survey Area Form",
      fieldConfigs: [
        {
          field_key: "name",
          label: "Name",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "address",
          label: "Address",
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: "area",
          label: "Area",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "city",
          label: "City",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "state",
          label: "State",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "pincode",
          label: "Pincode",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "ref_code",
          label: "Reff Code",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "status",
          label: "Status",
          field_type: FIELD_TYPES.Select,
          options: LAYER_STATUS_OPTIONS,
        },
        {
          field_key: "tags",
          label: "Tags",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "over_head_cable",
          label: "Name",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "cabling_required",
          label: "Name",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "poll_cabling_possible",
          label: "Name",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "broadband_availability",
          label: "Name",
          field_type: FIELD_TYPES.SelectCreatable,
        },
        {
          field_key: "cable_tv_availability",
          label: "Name",
          field_type: FIELD_TYPES.SelectCreatable,
        },
        {
          field_key: "locality_status",
          label: "Locality Status",
          field_type: FIELD_TYPES.Select,
          options: AREA_LOCALITY_OPTIONS,
        },
      ],
    },
  ],
};
