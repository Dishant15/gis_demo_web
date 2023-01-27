import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";

import { default as Icon } from "assets/markers/p_dp_view.svg";
import { default as EditIcon } from "assets/markers/p_dp_edit.svg";
import { FIELD_TYPES } from "components/common/DynamicForm";

export const LAYER_KEY = "p_dp";
export const PRE_UID = "DP";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = () => ({
  icon: Icon,
  pin: EditIcon,
});

export const DP_TYPE_OPTIONS = [
  { value: "H", label: "FTTH" },
  { value: "B", label: "FTTB" },
];

export const CABINET_TYPE_OPTIONS = [
  { value: "FA", label: "FAT" },
  { value: "JC", label: "Joint Closer" },
  { value: "CB", label: "Compass Box" },
  { value: "MB", label: "Metal Box" },
  { value: "FD", label: "FDC" },
];

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  dp_type: "H",
  cabinet_type: "FA",
  unique_id: "",
  network_id: "",
  ref_code: "",
  status: "RFS",
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Distribution Point Form",
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: "address",
          label: "Address",
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: "dp_type",
          label: "Dp Type",
          field_type: FIELD_TYPES.Select,
          options: DP_TYPE_OPTIONS,
        },
        {
          field_key: "cabinet_type",
          label: "Cabinet Type",
          field_type: FIELD_TYPES.Select,
          options: CABINET_TYPE_OPTIONS,
        },
      ],
    },
  ],
  // this shows where dependant template data comes from
  metaData: {
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Address", field: "address", type: "simple" },
  { label: "Dp Type", field: "dp_type_display", type: "simple" },
  { label: "Cabinet Type", field: "cabinet_type_display", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "add_associations",
    data: ["p_splitter"],
  },
  {
    control: "association_list",
  },
];
