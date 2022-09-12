export const LAYER_KEY = "p_splitter";

export const INITIAL_ELEMENT_DATA = {
  name: "",
  address: "",
  unique_id: "REG_SP_P_",
  ref_code: "",
  status: { value: "P", label: "Planned" },
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
          options: [
            { value: "T", label: "Ticket Open" },
            { value: "P", label: "Planned" },
            { value: "V", label: "Verified" },
          ],
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
          options: [
            { value: "P", label: "Primary" },
            { value: "S", label: "Secondary" },
          ],
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

export const transformAndValidateConfigData = (data) => ({
  ...data,
  splitter_type: data.splitter_type.value,
});
