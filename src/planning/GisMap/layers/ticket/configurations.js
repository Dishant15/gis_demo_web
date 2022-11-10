import { FEATURE_TYPES } from "../common/configuration";

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
