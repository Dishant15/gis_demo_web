import { FEATURE_TYPES, LAYER_STATUS_OPTIONS } from "../common/configuration";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import PrimarySpliterEditIcon from "assets/markers/spliter_edit_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";
import SecondarySpliterEditIcon from "assets/markers/spliter_edit.svg";

export const LAYER_KEY = "p_splitter";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = ({ splitter_type }) => ({
  icon: splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon,
  pin:
    splitter_type === "P" ? PrimarySpliterEditIcon : SecondarySpliterEditIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  unique_id: "REG_SP_P_",
  ref_code: "",
  status: "P",
  coordinates: {},
};

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Splitter Form",
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

export const INITIAL_CONFIG_DATA = {
  config_name: "",
  splitter_type: "",
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
          field_key: "ratio",
          label: "Ratio",
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
  { headerName: "Ratio", field: "ratio" },
  { headerName: "Splitter Type", field: "splitter_type_display" },
];

export const transformAndValidateConfigData = (data) => data;
