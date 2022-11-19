import React from "react";

import { Container, Paper } from "@mui/material";
import DynamicForm, { FIELD_TYPES } from "components/common/DynamicForm";

import { LAYER_STATUS_OPTIONS } from "planning/GisMap/layers/common/configuration";
import {
  AREA_TAG_OPTIONS,
  AREA_TV_PROVIDERS,
} from "planning/GisMap/layers/p_survey_area";

const TestDynamicForm = () => {
  return (
    <Container>
      <Paper p={3}>
        <DynamicForm
          formConfigs={ELEMENT_FORM_TEMPLATE}
          data={INITIAL_ELEMENT_DATA}
          onSubmit={(res) => {
            console.log("🚀 ~ file: HomePage ~ res", res);
          }}
          isLoading={false}
        />
      </Paper>
    </Container>
  );
};

export default TestDynamicForm;

const INITIAL_ELEMENT_DATA = {
  name: "",
  homepass: "0",
  unique_id: "1234",
  status: "",
  address: "",
  tags: "",
  over_head_cable: true,
  cabling_required: false,
  cable_tv_availability: "",
};

const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Survey Area Form",
      fieldConfigs: [
        {
          field_key: "name",
          label: "Name",
          field_type: FIELD_TYPES.Input,
          validationProps: {
            required: "Name is required",
          },
          // disabled: true,
        },
        {
          field_key: "homepass",
          label: "Homepass",
          field_type: FIELD_TYPES.Input,
          validationProps: {
            // required: "Homepass is required",
            validate: {
              positive: (v) => parseInt(v) > 0 || "homepass > 0",
              lessThanTen: (v) => parseInt(v) < 10 || "homepass < 10",
            },
          },
          // disabled: true,
        },
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: FIELD_TYPES.Input,
          // disabled: true,
          validationProps: {
            required: "Unique Id is required",
          },
        },
        {
          field_key: "status",
          label: "Status",
          field_type: FIELD_TYPES.Select,
          options: LAYER_STATUS_OPTIONS,
          // disabled: true,
          validationProps: {
            required: "Status is required",
          },
        },
        {
          field_key: "address",
          label: "Address",
          field_type: FIELD_TYPES.TextArea,
          // disabled: true,
          validationProps: {
            required: "Address is required",
          },
        },
        {
          field_key: "tags",
          label: "Tags",
          field_type: FIELD_TYPES.SelectMulti,
          options: AREA_TAG_OPTIONS,
          // disabled: true,
          validationProps: {
            required: "Tags is required",
          },
        },
        {
          field_key: "over_head_cable",
          label: "Over head cable allowed",
          field_type: FIELD_TYPES.CheckBox,
          // disabled: true,
          validationProps: {
            required: "Over head cable is required",
          },
        },
        {
          field_key: "cabling_required",
          label: "In Building cabeling required",
          field_type: FIELD_TYPES.CheckBox,
          // disabled: true,
          validationProps: {
            required: "In Building cabeling is required",
          },
        },
        {
          field_key: "cable_tv_availability",
          label: "Cable TV Service Availability",
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_TV_PROVIDERS,
          // disabled: true,
          validationProps: {
            required: "Cable TV Service is required",
          },
        },
      ],
    },
  ],
};
