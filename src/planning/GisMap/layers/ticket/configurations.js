import { FEATURE_TYPES } from "../common/configuration";
import Icon from "assets/markers/ticket.svg";

export const LAYER_KEY = "ticket";
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

const STROKE_COLOR = "#88B14B";
export const getViewOptions = () => ({
  strokeColor: STROKE_COLOR,
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: STROKE_COLOR,
  fillOpacity: 0.3,
  clickable: false,
  draggable: false,
  editable: false,
  icon: Icon,
  pin: Icon,
});

export const INITIAL_ELEMENT_DATA = {
  name: "",
  unique_id: "REG_TKT_",
  status: "A",
  ticket_type: "S",
  network_type: "B",
  due_date: "",
  remarks: "",
  updated_on: "",
  created_on: "",
};

export const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
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

export const ELEMENT_TABLE_EXTRA_CONTROLS = ["workorders"];
