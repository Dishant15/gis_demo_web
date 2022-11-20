import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";
import CableIcon from "assets/markers/line_pin.svg";

export const LAYER_KEY = "p_cable";
export const PRE_UID = "CBL";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYLINE;

export const getViewOptions = ({ color_on_map }) => {
  return {
    strokeColor: color_on_map,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color_on_map,
    fillOpacity: 1,
    clickable: false,
    draggable: false,
    editable: false,
    radius: 30000,
    icon: CableIcon,
    pin: CableIcon,
  };
};

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "",
  network_id: "",
  ref_code: "",
  status: "RFS",
  coordinates: [],
  // editable
  cable_type: "O",
  // gis_len ,actual_len, start_reading ,end_reading
};

export const CABLE_TYPE_OPTIONS = [
  { value: "O", label: "Overhead" },
  { value: "U", label: "Underground" },
  { value: "W", label: "Wall Clamped" },
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Cable Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: "cable_type",
          label: "Cable Type",
          field_type: "select",
          options: CABLE_TYPE_OPTIONS,
        },
        {
          field_key: "gis_len",
          label: "Gis Length (Km)",
          field_type: "input",
        },
        {
          field_key: "actual_len",
          label: "Actual Length",
          field_type: "input",
        },
        {
          field_key: "start_reading",
          label: "Start Reading",
          field_type: "input",
        },
        {
          field_key: "end_reading",
          label: "End Reading",
          field_type: "input",
        },
      ],
    },
  ],
};

export const INITIAL_CONFIG_DATA = {
  config_name: "",
  no_of_tube: "",
  core_per_tube: "",
  specification: "",
  color_on_map: "#FF0000",
  vendor: "",
};

export const CONFIG_LIST_TABLE_COL_DEFS = [
  { headerName: "Name", field: "config_name" },
  { headerName: "Tubes", field: "no_of_tube" },
  { headerName: "Core / Tube", field: "core_per_tube" },
  { headerName: "Color", field: "color_on_map" },
];

export const ELEMENT_CONFIG_TEMPLATE = {
  sections: [
    {
      title: "Cable Form",
      fieldConfigs: [
        {
          field_key: "config_name",
          label: "Name",
          field_type: "input",
        },
        {
          field_key: "no_of_tube",
          label: "No Of Tubes",
          field_type: "input",
        },
        {
          field_key: "core_per_tube",
          label: "Cores per tube",
          field_type: "input",
        },
        {
          field_key: "color_on_map",
          label: "Color on map",
          field_type: "input",
        },
        {
          field_key: "specification",
          label: "Specification",
          field_type: "textArea",
        },
        {
          field_key: "vendor",
          label: "Vendor",
          field_type: "input",
        },
      ],
    },
  ],
};

export const transformAndValidateConfigData = (data) => data;

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Cable Type", field: "cable_type_display", type: "simple" },
  { label: "Gis Length (Km)", field: "gis_len", type: "simple" },
  { label: "Actual Length", field: "actual_len", type: "simple" },
  { label: "Start Reading", field: "start_reading", type: "simple" },
  { label: "End Reading", field: "end_reading", type: "simple" },
  { label: "No of tubes", field: "no_of_tube", type: "simple" },
  { label: "Core / Tube", field: "core_per_tube", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
];

export const transformAndValidateData = (
  formData,
  setError,
  isEdit,
  configurationId
) => {
  if (isEdit) {
    return {
      ...formData,
      // remove geometry
      geometry: undefined,
    };
  } else {
    return {
      ...formData,
      // AddGisMapLayer will give transformed coordinates in geometry field
      // convert select fields to simple values
      configuration: configurationId,
    };
  }
};
