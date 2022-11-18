export const zIndexMapping = {
  region: 1,
  p_survey_area: 2,
  // 3 - 5 -> Polygons at the bottom
  // 6 - 7 -> Polylines at the bottom
  p_cable: 8,
  p_survey_building: 9,
  p_dp: 10,
  p_splitter: 11,

  edit: 50,
};

export const LAYER_STATUS_OPTIONS = [
  { value: "T", label: "Ticket Open" },
  { value: "P", label: "Planned" },
  { value: "V", label: "Verified" },
];

// also required by backend at the time of validations
export const FEATURE_TYPES = {
  POLYLINE: "polyline",
  POINT: "point",
  POLYGON: "polygon",
  MULTI_POLYGON: "multi_polygon",
};

// mapping drawing mode from feature type values
// for google map drawing mode string
export const MAP_DRAWING_MODE = {
  polyline: "polyline",
  polygon: "polygon",
  point: "marker",
  multi_polygon: "polygon",
};

export const ELEMENT_FORM_ABSTRACT_TEMPLATE = [
  {
    field_key: "name",
    label: "Name",
    field_type: "input",
  },
  {
    field_key: "unique_id",
    label: "Unique Id",
    field_type: "input",
    disabled: true,
  },
  {
    field_key: "network_id",
    label: "Network Id",
    field_type: "input",
    disabled: true,
  },
  {
    field_key: "ref_code",
    label: "Reff Code",
    field_type: "input",
  },
  {
    field_key: "status",
    label: "Status",
    field_type: "select",
    options: LAYER_STATUS_OPTIONS,
  },
];
