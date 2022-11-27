import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import PrimarySpliterEditIcon from "assets/markers/spliter_edit_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";
import SecondarySpliterEditIcon from "assets/markers/spliter_edit.svg";

export const LAYER_KEY = "p_splitter";
export const PRE_UID = "SP";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = ({ splitter_type }) => ({
  icon: splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon,
  pin:
    splitter_type === "P" ? PrimarySpliterEditIcon : SecondarySpliterEditIcon,
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

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Splitter Form",
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

export const INITIAL_CONFIG_DATA = {
  config_name: "",
  splitter_type: "P",
  ratio: "",
  specification: "",
  vendor: "",
};

export const SPLITTER_TYPE_OPTIONS = [
  { value: "P", label: "Primary" },
  { value: "S", label: "Secondary" },
];

export const ELEMENT_CONFIG_TEMPLATE = {
  sections: [
    {
      title: "Spliter Form",
      fieldConfigs: [
        {
          field_key: "config_name",
          label: "Name",
          field_type: "input",
        },
        {
          field_key: "splitter_type",
          label: "Splitter Type",
          field_type: "select",
          options: SPLITTER_TYPE_OPTIONS,
        },
        {
          field_key: "input_ports",
          label: "Input Ports",
          field_type: "input",
        },
        {
          field_key: "output_ports",
          label: "Output Ports",
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

export const CONFIG_LIST_TABLE_COL_DEFS = [
  { headerName: "Name", field: "config_name" },
  { headerName: "Input Ports", field: "input_ports" },
  { headerName: "Output Ports", field: "output_ports" },
  { headerName: "Splitter Type", field: "splitter_type_display" },
];

export const transformAndValidateConfigData = (data) => data;

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Splitter Type", field: "splitter_type_display", type: "simple" },
  { label: "Address", field: "address", type: "simple" },
  { label: "Input Ports", field: "input_ports", type: "simple" },
  { label: "Output Ports", field: "output_ports", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "connections",
  },
];

export const transformAndValidateData = (
  formData,
  setError,
  isEdit,
  configurationId
) => {
  if (isEdit) {
    return formData;
  } else {
    return {
      ...formData,
      // convert select fields to simple values
      configuration: configurationId,
    };
  }
};
