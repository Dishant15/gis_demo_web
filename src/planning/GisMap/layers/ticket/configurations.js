import {
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from "../common/configuration";
import Icon from "assets/markers/ticket.svg";

import get from "lodash/get";
import pick from "lodash/pick";

export const LAYER_KEY = "ticket";
export const PRE_UID = "TKT";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

const STROKE_COLOR = "#e55e5d";
export const getViewOptions = () => ({
  strokeColor: STROKE_COLOR,
  fillColor: STROKE_COLOR,
  icon: Icon,
  pin: Icon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  status: "A",
  ticket_type: "S",
  network_type: "RFS",
  due_date: "",
  remarks: "",
  updated_on: "",
  created_on: "",
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  { label: "Ticket Type", field: "ticket_type_display", type: "simple" },
  { label: "Network Type", field: "network_type_display", type: "simple" },
  { label: "Due Date", field: "due_date", type: "date" },
  { label: "Remarks", field: "remarks", type: "simple" },
  // { label: "Assignee", field: "assignee.name", type: "simple" }, // need to update serializer, fix assignee in ticket edit after updating details serializer
  { label: "Updated On", field: "updated_on", type: "date" },
  { label: "Created On", field: "created_on", type: "date" },
  { label: "Created By", field: "created_by.name", type: "simple" },
  { label: "Ticket Status", field: "status_display", type: "simple" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: "workorders",
  },
];

// submitData : { ...elemPartialData }
// children : { layerKey: [child1, child2]}
export const getDependantFields = ({ submitData, children, region_list }) => {
  return {
    ...submitData,
    region: pick(get(region_list, "0", {}), ["id", "name"]),
  };
};
