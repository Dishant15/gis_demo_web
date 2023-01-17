import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
  FEATURE_TYPES,
} from "../common/configuration";
import CableIcon from "assets/markers/line_pin.svg";

export const LAYER_KEY = "p_cable";
export const PRE_UID = "CBL";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYLINE;

const dashLineSymbol = {
  path: "M 0,-2 0,2",
  strokeOpacity: 1,
};

const dotLineSymbol = {
  path: "M 0,2 0,2",
  strokeOpacity: 1,
};

export const getViewOptions = ({ color_on_map, cable_type }) => {
  switch (cable_type) {
    case "U":
      return {
        strokeColor: color_on_map,
        strokeOpacity: 0,
        strokeWeight: 5,
        clickable: false,
        draggable: false,
        editable: false,
        radius: 30000,
        geodesic: true,
        icons: [
          {
            icon: dotLineSymbol,
            offset: "0px",
            repeat: "10px",
          },
        ],
        icon: CableIcon,
        pin: CableIcon,
      };
    case "W":
      return {
        strokeColor: color_on_map,
        strokeOpacity: 0,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        radius: 30000,
        geodesic: true,
        icons: [
          {
            icon: dashLineSymbol,
            offset: "0px",
            repeat: "18px",
          },
        ],
        icon: CableIcon,
        pin: CableIcon,
      };
    default:
      // cable_type => "O"
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
  }
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
  start_reading: 0,
  end_reading: 0,
};

export const CABLE_TYPE_OPTIONS = [
  { value: "O", label: "Overhead" },
  { value: "U", label: "Underground" },
  { value: "W", label: "Wall Clamped" },
];

export const CONFIG_LIST_TABLE_COL_DEFS = [
  { headerName: "Name", field: "config_name" },
  { headerName: "Tubes", field: "no_of_tube" },
  { headerName: "Ribbon count", field: "ribbon_count" },
  { headerName: "Core / Tube", field: "core_per_tube" },
  { headerName: "Color", field: "color_on_map" },
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      ...ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
      title: "Cable Configuration",
      table_fields: CONFIG_LIST_TABLE_COL_DEFS,
    },
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
          disabled: true,
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
  // this shows where dependant template data comes from
  metaData: {
    geometryUpdateFields: ["gis_len"],
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
};

export const INITIAL_CONFIG_DATA = {
  config_name: "",
  no_of_tube: "",
  core_per_tube: "",
  specification: "",
  color_on_map: "#FF0000",
  vendor: "",
};

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
          field_key: "ribbon_count",
          label: "Ribbon Count",
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

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Cable Type", field: "cable_type_display", type: "simple" },
  { label: "Gis Length (Km)", field: "gis_len", type: "simple" },
  { label: "Actual Length", field: "actual_len", type: "simple" },
  { label: "Start Reading", field: "start_reading", type: "simple" },
  { label: "End Reading", field: "end_reading", type: "simple" },
  { label: "No of tubes", field: "no_of_tube", type: "simple" },
  { label: "Ribbon Count", field: "ribbon_count", type: "simple" },
  { label: "Core / Tube", field: "core_per_tube", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "ports",
  },
];
