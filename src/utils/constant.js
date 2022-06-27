export const CLIENT_ID = "react";

export const TicketTypeList = [
  { label: "Survey", value: "S" },
  { label: "Planning", value: "P" },
  { label: "Client", value: "C" },
];
export const NetworkTypeList = [
  { label: "As Build", value: "B" },
  { label: "As Planned", value: "P" },
];

export const TicketStatusList = [
  { label: "Active", value: "A" },
  { label: "Completed", value: "C" },
  { label: "In Active", value: "I" },
];

export const workOrderStatusTypes = {
  S: {
    value: "S",
    label: "Submited",
    color: "warning",
  },
  V: {
    value: "V",
    label: "Verified",
    color: "success",
  },
  R: {
    value: "R",
    label: "Rejected",
    color: "error",
  },
};

export const BroadbandProviders = [
  {
    label: "GTPL",
    value: "GTPL",
  },
  {
    label: "JIO",
    value: "JIO",
  },
  {
    label: "Airtel",
    value: "Airtel",
  },
];

export const TVProviders = [
  {
    label: "GTPL",
    value: "GTPL",
  },
  {
    label: "DEN",
    value: "DEN",
  },
  {
    label: "IN CABLE",
    value: "IN CABLE",
  },
];

export const SURVEY_TAG_LIST = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Government", value: "government" },
  { label: "Hospital", value: "hospital" },
  { label: "Educational", value: "educational" },
];

export const LOCALITY_OPTS = [
  { label: "High", value: "1" },
  { label: "Medium", value: "2" },
  { label: "Average", value: "3" },
  { label: "Poor", value: "4" },
];
