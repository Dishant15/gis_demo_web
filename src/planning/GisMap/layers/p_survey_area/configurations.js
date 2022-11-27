import { FIELD_TYPES } from "components/common/DynamicForm";
import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";
import Icon from "assets/markers/path.svg";

export const LAYER_KEY = "p_survey_area";
export const PRE_UID = "SA";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

const STROKE_COLOR = "#CE855A";
export const getViewOptions = () => ({
  strokeColor: STROKE_COLOR,
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: STROKE_COLOR,
  fillOpacity: 0.3,
  clickable: false,
  draggable: false,
  editable: false,
  icon: Icon,
  pin: Icon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "",
  network_id: "",
  ref_code: "",
  status: "RFS",
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  tags: "",
  home_pass: 0,
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

export const AREA_TAG_OPTIONS = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Government", value: "government" },
  { label: "Hospital", value: "hospital" },
  { label: "Educational", value: "educational" },
];

export const AREA_BROADBAND_PROVIDERS = [
  {
    label: "GTPL",
    value: "GTPL",
  },
  {
    label: "JIO",
    value: "JIO",
  },
  {
    label: "Airtel",
    value: "Airtel",
  },
];

export const AREA_TV_PROVIDERS = [
  {
    label: "GTPL",
    value: "GTPL",
  },
  {
    label: "DEN",
    value: "DEN",
  },
  {
    label: "IN CABLE",
    value: "IN CABLE",
  },
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Survey Area Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
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
          field_key: "tags",
          label: "Tags",
          field_type: FIELD_TYPES.SelectMulti,
          options: AREA_TAG_OPTIONS,
        },
        {
          field_key: "home_pass",
          label: "Home Pass",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "over_head_cable",
          label: "Over head cable allowed",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "cabling_required",
          label: "In Building cabeling required",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "poll_cabling_possible",
          label: "Pole to pole cabling possible",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "broadband_availability",
          label: "Broadband Service Availability",
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_BROADBAND_PROVIDERS,
        },
        {
          field_key: "cable_tv_availability",
          label: "Cable TV Service Availability",
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_TV_PROVIDERS,
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

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Address", field: "address", type: "simple" },
  { label: "Area", field: "area", type: "simple" },
  { label: "City", field: "city", type: "simple" },
  { label: "State", field: "state", type: "simple" },
  { label: "Pincode", field: "pincode", type: "simple" },
  { label: "Tags", field: "tags", type: "simple" },
  { label: "Home Pass", field: "home_pass", type: "simple" },
  { label: "Over Head Cable", field: "over_head_cable", type: "boolean" },
  { label: "Cabling Required", field: "cabling_required", type: "boolean" },
  {
    label: "Poll Cabling possible",
    field: "poll_cabling_possible",
    type: "boolean",
  },
  {
    label: "Locality Status",
    field: "locality_status_display",
    type: "simple",
  },
  // multi select comma separeted string
  {
    label: "Broadband Availability",
    field: "broadband_availability",
    type: "simple",
  },
  {
    label: "Cable Tv Availability",
    field: "cable_tv_availability",
    type: "simple",
  },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "add_associations",
    data: ["p_survey_building"],
  },
  {
    control: "association_list",
  },
];
