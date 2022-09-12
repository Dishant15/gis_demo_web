export const LAYER_KEY = "p_cable";

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "REG_SP_P_",
  ref_code: "",
  status: { value: "P", label: "Planned" },
  coordinates: [],
  // editable
  cable_type: { value: "O", label: "Overhead" },
  // gis_len ,actual_len, start_reading ,end_reading
};

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Cable Form",
      fieldConfigs: [
        {
          field_key: "name",
          label: "Name",
          field_type: "input",
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
          options: [
            { value: "T", label: "Ticket Open" },
            { value: "P", label: "Planned" },
            { value: "V", label: "Verified" },
          ],
        },
        {
          field_key: "cable_type",
          label: "Cable Type",
          field_type: "select",
          options: [
            { value: "O", label: "Overhead" },
            { value: "U", label: "Underground" },
            { value: "W", label: "Wall Clamped" },
          ],
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
