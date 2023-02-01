import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";
import { FIELD_TYPES } from "components/common/DynamicForm";

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
      ...ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
      title: "Spliter Configuration",
    },
    {
      title: "Splitter Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: "address",
          label: "Address",
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: "contact_name",
          label: "Contact Name",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "contact_no",
          label: "Contact No",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "is_rented",
          label: "Rented",
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: "rent_amount",
          label: "Amount",
          field_type: FIELD_TYPES.Input,
          isHidden: (props) => {
            return !props.is_rented;
          },
        },
        {
          field_key: "agreement_start_date",
          label: "Agreement start date",
          field_type: FIELD_TYPES.DateTime,
          isHidden: (props) => {
            return !props.is_rented;
          },
        },
        {
          field_key: "agreement_end_date",
          label: "Agreement end date",
          field_type: FIELD_TYPES.DateTime,
          isHidden: (props) => {
            return !props.is_rented;
          },
        },
      ],
    },
  ],
  dependencyFields: ["is_rented"],
  // this shows where dependant template data comes from
  metaData: {
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
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
          disable_on_edit: true,
        },
        {
          field_key: "output_ports",
          label: "Output Ports",
          field_type: "input",
          disable_on_edit: true,
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

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Splitter Type", field: "splitter_type_display", type: "simple" },
  { label: "Address", field: "address", type: "simple" },
  { label: "Contact Name", field: "contact_name", type: "simple" },
  { label: "Contact No", field: "contact_no", type: "simple" },
  { label: "Rented", field: "is_rented", type: "boolean" },
  { label: "Rent Amount", field: "rent_amount", type: "simple" },
  {
    label: "Agreement start date",
    field: "agreement_start_date",
    type: "date",
  },
  { label: "Agreement end date", field: "agreement_end_date", type: "date" },
  { label: "Input Ports", field: "input_ports", type: "simple" },
  { label: "Output Ports", field: "output_ports", type: "simple" },
  { label: "Specification", field: "specification", type: "simple" },
  { label: "Vendor", field: "vendor", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "connections",
  },
  {
    control: "ports",
  },
];
