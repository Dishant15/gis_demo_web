import { getFillColor } from "utils/map.utils";
import { FEATURE_TYPES } from "../common/configuration";
import { FIELD_TYPES } from "components/common/DynamicForm";

import Icon from "assets/markers/pentagon.svg";
import { get } from "lodash";

export const LAYER_KEY = "region";
// never use this to generate region, this will be given by user
export const PRE_UID = "RGN";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.MULTI_POLYGON;

export const getViewOptions = (props = {}) => {
  const { layer } = props;
  const color = getFillColor(layer);

  return {
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.3,
    icon: Icon,
    pin: Icon,
  };
};

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "",
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: "Region Form",
      fieldConfigs: [
        {
          field_key: "name",
          label: "Name",
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: FIELD_TYPES.Input,
          disabled: true,
        },
        {
          field_key: "layer",
          label: "Layer",
          field_type: FIELD_TYPES.Input,
          disabled: true,
        },
        {
          field_key: "parentId",
          label: "Parent ID",
          field_type: FIELD_TYPES.Input,
          disabled: true,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
  { label: "Layer", field: "layer", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "add_associations",
    data: ["region"],
  },
  {
    control: "association_list",
  },
];

// submitData : { ...elemPartialData }
// parents : { layerKey: [child1, child2]}
export const getDependantFields = ({ submitData, parents }) => {
  const parentRegion = get(parents, "region.0", null);
  // add parent fields for child region
  // show incremented layer
  if (!!parentRegion) {
    return {
      ...submitData,
      layer: parentRegion.layer ? parentRegion.layer + 1 : 1,
      parentId: parentRegion.id,
    };
  } else {
    return submitData;
  }
};
